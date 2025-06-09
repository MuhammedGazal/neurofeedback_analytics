// /home/ubuntu/app/neurofeedback_analytics/src/utils/bluetoothService.js

/**
 * Bluetooth Service for Myo Gesture Armband
 * 
 * This service handles Bluetooth connectivity with the Myo Gesture Armband
 * using Web Bluetooth API for modern browsers.
 */

class MyoBluetoothService {
  constructor() {
    this.device = null;
    this.server = null;
    this.emgCharacteristic = null;
    this.imuCharacteristic = null;
    this.controlCharacteristic = null;
    this.connected = false;
    this.listeners = [];
    
    // Myo Armband Bluetooth service and characteristic UUIDs
    this.MYO_SERVICE_UUID = 'd5060001-a904-deb9-4748-2c7f4a124842';
    this.EMG_DATA_UUID = 'd5060005-a904-deb9-4748-2c7f4a124842';
    this.IMU_DATA_UUID = 'd5060002-a904-deb9-4748-2c7f4a124842';
    this.CONTROL_UUID = 'd5060401-a904-deb9-4748-2c7f4a124842';
  }

  /**
   * Check if Web Bluetooth API is supported in the browser
   */
  isBluetoothSupported() {
    return navigator.bluetooth !== undefined;
  }

  /**
   * Connect to Myo Armband via Bluetooth
   * @returns {Promise} Connection status
   */
  async connect() {
    if (!this.isBluetoothSupported()) {
      throw new Error('Web Bluetooth API is not supported in this browser');
    }

    try {
      // Request the device with Myo service UUID
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{
          services: [this.MYO_SERVICE_UUID]
        }],
        optionalServices: [this.MYO_SERVICE_UUID]
      });

      // Add event listener for disconnection
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));

      // Connect to the GATT server
      this.server = await this.device.gatt.connect();

      // Get the Myo service
      const service = await this.server.getPrimaryService(this.MYO_SERVICE_UUID);

      // Get characteristics for EMG, IMU, and control
      this.emgCharacteristic = await service.getCharacteristic(this.EMG_DATA_UUID);
      this.imuCharacteristic = await service.getCharacteristic(this.IMU_DATA_UUID);
      this.controlCharacteristic = await service.getCharacteristic(this.CONTROL_UUID);

      // Subscribe to EMG notifications
      await this.emgCharacteristic.startNotifications();
      this.emgCharacteristic.addEventListener('characteristicvaluechanged', this.handleEMGData.bind(this));

      // Subscribe to IMU notifications
      await this.imuCharacteristic.startNotifications();
      this.imuCharacteristic.addEventListener('characteristicvaluechanged', this.handleIMUData.bind(this));

      // Set connected status
      this.connected = true;

      // Initialize the device with appropriate commands
      await this.initializeDevice();

      return {
        status: 'connected',
        deviceName: this.device.name || 'Myo Armband'
      };
    } catch (error) {
      console.error('Error connecting to Myo device:', error);
      this.connected = false;
      throw error;
    }
  }

  /**
   * Initialize the Myo device with appropriate commands
   * @private
   */
  async initializeDevice() {
    if (!this.controlCharacteristic) return;

    try {
      // Command to enable EMG data streaming
      const enableEMG = new Uint8Array([0x01, 0x03, 0x02, 0x01, 0x01]);
      await this.controlCharacteristic.writeValue(enableEMG);

      // Command to enable IMU data streaming
      const enableIMU = new Uint8Array([0x01, 0x02, 0x01, 0x01]);
      await this.controlCharacteristic.writeValue(enableIMU);

      // Set sampling rate (50Hz is commonly used)
      const setSamplingRate = new Uint8Array([0x03, 0x01, 0x32]); // 50Hz
      await this.controlCharacteristic.writeValue(setSamplingRate);
    } catch (error) {
      console.error('Error initializing Myo device:', error);
    }
  }

  /**
   * Handle EMG data from the Myo armband
   * @param {Event} event - Characteristic value changed event
   * @private
   */
  handleEMGData(event) {
    const dataView = event.target.value;
    const emgData = [];

    // Parse EMG data from dataView (8 channels)
    for (let i = 0; i < 8; i++) {
      // Myo typically sends signed 8-bit integers for EMG data
      emgData.push(dataView.getInt8(i));
    }

    // Process data and calculate RMS values
    const channels = emgData.map((value, index) => ({
      channel: index + 1,
      value: value,
      rms: Math.abs(value), // Simple approximation, real RMS would use a window of samples
      quality: Math.abs(value) < 200 ? 'good' : 'poor' // Simple quality assessment
    }));

    // Notify listeners with processed data
    this.notifyListeners('emg', {
      timestamp: Date.now(),
      channels
    });
  }

  /**
   * Handle IMU data from the Myo armband
   * @param {Event} event - Characteristic value changed event
   * @private
   */
  handleIMUData(event) {
    const dataView = event.target.value;
    
    // Parse accelerometer data (3 axes, 16-bit integers)
    const accelerometer = {
      x: dataView.getInt16(0, true) / 2048.0, // Scale to g
      y: dataView.getInt16(2, true) / 2048.0,
      z: dataView.getInt16(4, true) / 2048.0
    };

    // Parse gyroscope data (3 axes, 16-bit integers)
    const gyroscope = {
      x: dataView.getInt16(6, true) / 16.0, // Scale to deg/s
      y: dataView.getInt16(8, true) / 16.0,
      z: dataView.getInt16(10, true) / 16.0
    };

    // Parse quaternion data (4 components, 16-bit integers)
    const quaternion = {
      w: dataView.getInt16(12, true) / 16384.0,
      x: dataView.getInt16(14, true) / 16384.0,
      y: dataView.getInt16(16, true) / 16384.0,
      z: dataView.getInt16(18, true) / 16384.0
    };

    // Notify listeners with processed data
    this.notifyListeners('imu', {
      accelerometer,
      gyroscope,
      quaternion
    });
  }

  /**
   * Handle disconnection event
   * @private
   */
  onDisconnected() {
    this.connected = false;
    this.server = null;
    this.emgCharacteristic = null;
    this.imuCharacteristic = null;
    this.controlCharacteristic = null;
    
    // Notify listeners of disconnection
    this.notifyListeners('connectionStatus', { status: 'disconnected' });
  }

  /**
   * Disconnect from the Myo device
   */
  disconnect() {
    if (this.device && this.connected) {
      this.device.gatt.disconnect();
    }
  }

  /**
   * Add a listener for Myo data events
   * @param {string} event - Event type ('emg', 'imu', 'connectionStatus')
   * @param {Function} callback - Callback function to execute when event occurs
   */
  addEventListener(event, callback) {
    this.listeners.push({ event, callback });
  }

  /**
   * Remove a listener
   * @param {string} event - Event type
   * @param {Function} callback - Callback function to remove
   */
  removeEventListener(event, callback) {
    this.listeners = this.listeners.filter(
      listener => listener.event !== event || listener.callback !== callback
    );
  }

  /**
   * Notify all listeners of a specific event
   * @param {string} event - Event type
   * @param {Object} data - Event data
   * @private
   */
  notifyListeners(event, data) {
    this.listeners
      .filter(listener => listener.event === event)
      .forEach(listener => listener.callback(data));
  }

  /**
   * Get current connection status
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.connected;
  }

  /**
   * Get the connected device name
   * @returns {string|null} Device name or null if not connected
   */
  getDeviceName() {
    return this.device?.name || null;
  }

  /**
   * Enable/disable haptic feedback
   * @param {boolean} enabled - Whether haptic feedback should be enabled
   */
  async setHapticFeedback(enabled) {
    if (!this.controlCharacteristic || !this.connected) {
      return false;
    }

    try {
      // Command to enable/disable haptic feedback
      const hapticCommand = new Uint8Array([0x03, 0x01, enabled ? 0x01 : 0x00]);
      await this.controlCharacteristic.writeValue(hapticCommand);
      return true;
    } catch (error) {
      console.error('Error setting haptic feedback:', error);
      return false;
    }
  }
}

// Create a singleton instance
const bluetoothService = new MyoBluetoothService();

export default bluetoothService;