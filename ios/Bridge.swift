import Foundation
import CoreBluetooth

@objc(Bridge)
class Bridge: RCTEventEmitter {

    @objc override func supportedEvents() -> [String]! {
        return ["device", "peripheralstate", "contact"]
    }

    var discovery: BLEDiscovery?
    var peripheral: Peripheral?

    @objc
    func startDiscovery() {
        discovery = BLEDiscovery(onDiscovered: { [weak self] peripheral in
            self?.sendEvent(withName: "device", body: peripheral.toBridgeObject())
        })
    }

    @objc
    func startAdvertising() {
        peripheral = Peripheral(delegate: self)
    }

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        true
    }
}

extension Bridge: PeripheralDelegate {

    func onPeripheralStateChange(description: String) {
        sendEvent(withName: "peripheralstate", body: description)
    }

    func onNewContact(_ contact: Contact) {
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
            "identifier": identifier as AnyObject,
            "timestamp": timestamp as AnyObject,
            "isPotentiallyInfectious": isPotentiallyInfectious as AnyObject
        ]
    }
}
