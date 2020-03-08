import Foundation
import CoreBluetooth

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
            print("BLE unknown")
        case .resetting:
            print("BLE resetting")
        case .unsupported:
            print("BLE unsupported")
        case .unauthorized:
            print("BLE unauthorized")
        case .poweredOff:
            print("BLE poweredOff")
        case .poweredOn:
            print("BLE poweredOn")
            centralManager.scanForPeripherals(withServices: nil)
        @unknown default:
            print("BLE default")
        }
    }

    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral,
                        advertisementData: [String: Any], rssi RSSI: NSNumber) {
        onDiscovered?(peripheral)
    }
}
