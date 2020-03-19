import * as Font from "expo-font"

import Roboto from "../../node_modules/native-base/Fonts/Roboto.ttf"
import Roboto_medium from "../../node_modules/native-base/Fonts/Roboto_medium.ttf"
import Entypo from "../../node_modules/native-base/Fonts/Entypo.ttf"
import Feather from "../../node_modules/native-base/Fonts/Feather.ttf"
import FontAwesome from "../../node_modules/native-base/Fonts/FontAwesome.ttf"
import Octicons from "../../node_modules/native-base/Fonts/Octicons.ttf"


import { TaskMachine } from './common'
import { getItemAsync, setItemAsync } from "expo-secure-store"

const DEFAULT_SETTINGS = {
    geofence_radius: 50,
    movement_timeout: 60
}

export const BootSetupMachine = TaskMachine({
    id: 'boot_setup',
    task: async () => {
        await Font.loadAsync({
            Roboto,
            Roboto_medium,
            Entypo,
            Feather,
            FontAwesome,
            // MaterialIcons from "native-base/Fonts/MaterialIcons.ttf"),
            // MaterialCommunityIcons from "native-base/Fonts/MaterialCommunityIcons.ttf"),
            Octicons,
            // Zocial from "@expo/vector-icons/fonts/Zocial.šttf"),
            // SimpleLineIcons from "native-base/Fonts/SimpleLineIcons.ttf"),
            // EvilIcons from "native-base/Fonts/EvilIcons.ttf"),
            // ...Ionicons.font,
        }).then(() => console.log('font loaded', Roboto_medium)).catch(e => console.error(e))
        
        await setItemAsync('settings', (await getItemAsync('settings')) || JSON.stringify(DEFAULT_SETTINGS))
    }
})
