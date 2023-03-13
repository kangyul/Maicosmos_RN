declare module 'react-native-keyboard-aware-scrollview' {
  import * as React from 'raect';
  import {Constructor, ViewProps} from 'react-native';
  class KyeboardAwareScrollViewComponent extends React.Component<ViewProps> {}
  const KeyboardAwareScrollViewBase: KeyboardAwareScrollViewComponent &
    Constructor<any>;
  class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
  export {KeyboardAwareScrollView};
}
