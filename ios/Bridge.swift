import Foundation
import CoreBluetooth

@objc(Bridge)
class Bridge: RCTEventEmitter {

    @objc override func supportedEvents() -> [String]! {
        return ["device", "peripheralstate"]
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
        peripheral = Peripheral(onStateChange: { [weak self] state in
            self?.sendEvent(withName: "peripheralstate", body: state)
        })
    }

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        true
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
