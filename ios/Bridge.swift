import Foundation
import CoreBluetooth
import os.log

@objc(Bridge)
class Bridge: RCTEventEmitter {

    @objc override func supportedEvents() -> [String]! {
        return ["device", "peripheralstate", "contact"]
    }

    var central: Central?
    var peripheral: Peripheral?

    @objc
    func startDiscovery() {
        central = Central(delegate: self)
    }

    @objc
    func startAdvertising() {
        peripheral = Peripheral(delegate: self)
    }

    @objc
    func stopBle() {
        central?.stop()
        peripheral?.stop()
        central = nil
        peripheral = nil
        os_log("Ble stopped", log: bleGeneralLog)
    }

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        true
    }
}

extension Bridge: CentralDelegate {

    func onDiscovered(peripheral: CBPeripheral) {
        sendEvent(withName: "device", body: peripheral.toBridgeObject())
    }

    func onCentralContact(_ contact: Contact) {
        sendEvent(withName: "contact", body: contact.toBridgeObject())
    }
}


extension Bridge: PeripheralDelegate {

    func onPeripheralStateChange(description: String) {
        sendEvent(withName: "peripheralstate", body: description)
    }

    func onPeripheralContact(_ contact: Contact) {
        sendEvent(withName: "contact", body: contact.toBridgeObject())
    }
}

extension CBPeripheral {
    func toBridgeObject() -> [String : AnyObject] {
        [
            "name": (name ?? "") as AnyObject,
            "address": identifier.uuidString as AnyObject
        ]
    }
}

extension Contact {
    func toBridgeObject() -> [String : AnyObject] {
        [
            "identifier": identifier.uuidString as AnyObject,
            "timestamp": timestamp as AnyObject,
            "isPotentiallyInfectious": isPotentiallyInfectious as AnyObject
        ]
    }
}
