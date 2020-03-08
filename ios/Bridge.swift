import Foundation
import CoreBluetooth

@objc(Bridge)
class Bridge: RCTEventEmitter {

    @objc override func supportedEvents() -> [String]! {
        return ["device"]
    }

    var ble: BLEDiscovery?

    @objc
    func startDiscovery() {
        ble = BLEDiscovery(onDiscovered: { [weak self] peripheral in
            self?.sendEvent(withName: "device", body: peripheral.toBridgeObject())
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
