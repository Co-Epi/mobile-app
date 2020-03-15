import Foundation
import CoreBluetooth
import os.log

class BLEDiscovery: NSObject, CBCentralManagerDelegate {
    private let onDiscovered: ((CBPeripheral) -> Void)?
    private var centralManager: CBCentralManager!

    init(onDiscovered: ((CBPeripheral) -> Void)?) {
        self.onDiscovered = onDiscovered
        super.init()
        centralManager = CBCentralManager(delegate: self, queue: nil)
    }

    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        switch central.state {
        case .unknown:
            os_log("BLE unknown", log: bluetoothLog)
        case .resetting:
            os_log("BLE resetting", log: bluetoothLog)
        case .unsupported:
            os_log("BLE unsupported", log: bluetoothLog)
        case .unauthorized:
            os_log("BLE unauthorized", log: bluetoothLog)
        case .poweredOff:
            os_log("BLE poweredOff", log: bluetoothLog)
        case .poweredOn:
            os_log("BLE poweredOn", log: bluetoothLog)
            centralManager.scanForPeripherals(withServices: nil)
        @unknown default:
            os_log("BLE default", log: bluetoothLog)
        }
    }

    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral,
                        advertisementData: [String: Any], rssi RSSI: NSNumber) {
        onDiscovered?(peripheral)
    }
}
