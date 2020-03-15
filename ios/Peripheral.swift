import Foundation
import CoreBluetooth
import os.log

protocol PeripheralDelegate: class {
    func onPeripheralStateChange(description: String)
    func onNewContact(_ contact: Contact)
}

class Peripheral: NSObject {
    private weak var delegate: PeripheralDelegate?

    private var peripheralManager: CBPeripheralManager!

    private let serviceUuid = CBUUID(nsuuid: UUID(uuidString: "BC908F39-52DB-416F-A97E-6EAC29F59CA8")!)
    private let characteristicUuid = CBUUID(nsuuid: UUID(uuidString: "2ac35b0b-00b5-4af2-a50e-8412bcb94285")!)

    init(delegate: PeripheralDelegate) {
        self.delegate = delegate

        super.init()
        peripheralManager = CBPeripheralManager(delegate: self, queue: nil)
    }

    private func startAdvertising() {
        let service = createService()
        peripheralManager.add(service)

        peripheralManager.startAdvertising([
            // NOTE/TODO this identifier is supposed to show directly in discovery. It doesn't. Service is listed in iPhone peripheral.
            CBAdvertisementDataLocalNameKey : "BLEPeripheralApp",

            CBAdvertisementDataServiceUUIDsKey : [serviceUuid]
        ])
    }

    private func createService() -> CBMutableService {
        let service = CBMutableService(type: serviceUuid, primary: true)

        let characteristic = CBMutableCharacteristic(
            type: characteristicUuid,
            properties: [.read],
            value: nil,
            permissions: [.readable]
        )
        service.characteristics = [characteristic]

        os_log("Peripheral manager adding service: %@", log: bluetoothLog, service)

        return service
    }
}

extension Peripheral: CBPeripheralManagerDelegate {

    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        switch peripheral.state {
        case .unknown:
            report(state: "unknown")
        case .unsupported:
            report(state: "unsupported")
        case .unauthorized:
            report(state: "unauthorized")
        case .resetting:
            report(state: "resetting")
        case .poweredOff:
            report(state: "poweredOff")
        case .poweredOn:
            report(state: "poweredOn")
            startAdvertising()
        @unknown default:
            os_log("Peripheral state: unknown")
        }
    }

    private func report(state: String) {
        delegate?.onPeripheralStateChange(description: state)
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, didAdd service: CBService, error: Error?) {
        if let error = error {
            os_log("Advertising error: %@", log: bluetoothLog, type: .error, error.localizedDescription)
        } else {
            os_log("Peripheral manager did add service=%@", log: bluetoothLog, service)
        }

    }

    func peripheralManagerDidStartAdvertising(_ peripheral: CBPeripheralManager, error: Error?) {
        if let error = error {
            os_log("Advertising error: %@", log: bluetoothLog, type: .error, error.localizedDescription)
        } else {
            os_log("Peripheral manager starting advertising", log: bluetoothLog)
        }
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveRead request: CBATTRequest) {
        os_log("Peripheral manager did receive read request: %@", request.description)

        let identifier = UUID()
        addNewContactEvent(with: identifier)
        request.value = identifier.dataRepresentation
        peripheral.respond(to: request, withResult: .success)

        os_log("Peripheral manager did respond to read request with result: %d", CBATTError.success.rawValue)
    }

    private func addNewContactEvent(with identifier: UUID) {
        delegate?.onNewContact(Contact(
            identifier: identifier,
            timestamp: Date(),
            // TODO preference, from React Native
            isPotentiallyInfectious: true
        ))
    }
}

struct Contact {
    let identifier: UUID
    let timestamp: Date
    let isPotentiallyInfectious: Bool
}
