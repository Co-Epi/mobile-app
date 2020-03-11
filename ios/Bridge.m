#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(Bridge, NSObject)
// FIXME "No bundle URL present" if both are enabled.
//    RCT_EXTERN_METHOD(startDiscovery)
    RCT_EXTERN_METHOD(startAdvertising)
@end
