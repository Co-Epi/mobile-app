import Foundation
import CoreBluetooth

class Peripheral: NSObject {

    private var peripheralManager: CBPeripheralManager!

    private let serviceUuid = CBUUID(nsuuid: UUID(uuidString: "BC908F39-52DB-416F-A97E-6EAC29F59CA8")!)
    private let characteristicUuid = CBUUID(nsuuid: UUID(uuidString: "2ac35b0b-00b5-4af2-a50e-8412bcb94285")!)

    override init() {
        super.init()
        peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
    }

    private func startAdvertising() {
        let service = createService()
        peripheralManager.add(service)

        print("Will start advertising")

        peripheralManager.startAdvertising([
            // NOTE/TODO this identifier is supposed to show directly in discovery. It doesn't. Service is listed in iPhone peripheral.
            CBAdvertisementDataLocalNameKey : "BLEPeripheralApp",

            CBAdvertisementDataServiceUUIDsKey : [serviceUuid]
        ])

        print("Started advertising")
    }

    private func createService() -> CBMutableService {
        let service = CBMutableService(type: serviceUuid, primary: true)

        let characteristic = CBMutableCharacteristic(
            type: characteristicUuid,
            properties: [.read],
            value: "AD34E".data(using: .utf8),
            permissions: [.readable]
        )
        service.characteristics = [characteristic]

        return service
    }
}

extension Peripheral: CBPeripheralManagerDelegate {

    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        switch peripheral.state {
        case .unknown:
            print("Peripheral state: unknown")
        case .unsupported:
            print("Peripheral state: unsupported")
        case .unauthorized:
            print("Peripheral state: unauthorized")
        case .resetting:
            print("Peripheral state: resetting")
        case .poweredOff:
            print("Peripheral state: poweredOff")
        case .poweredOn:
            print("Peripheral state: poweredOn")
            startAdvertising()
        @unknown default:
            print("Peripheral state: unknown")
        }
    }

    func peripheralManagerDidStartAdvertising(_ peripheral: CBPeripheralManager, error: Error?) {
        if error == nil {
            NSLog("Advertising ok")
        } else {
            NSLog("Advertising error: \(String(describing: error))")
        }
    }
}
