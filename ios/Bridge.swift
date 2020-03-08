import Foundation
import CoreBluetooth

@objc(Bridge)
class Bridge: RCTEventEmitter {

    @objc override func supportedEvents() -> [String]! {
        return ["device"]
    }

    var ble: BLEDiscovery?

    override init() {
        super.init()
        ble = BLEDiscovery(onDiscovered: { [weak self] peripheral in
            self?.sendEvent(withName: "device", body: peripheral.toBridgeObject())
        })
    }

    @objc
    func randomFunction() {
        print("Called randomFunction")
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
