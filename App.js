import React, {Component} from 'react';
import RootScene from './RootSceen'
import {Provider} from 'mobx-react/native'
import stores from './src/store'

export default class App extends Component<> {

    componentDidMount() {
        //     SplashScreen.hide();

        if (!__DEV__) {
            global.console = {
                info: () =>{

                },
                log: () =>{

                },
                warn: () =>{

                },
                error: () =>{

                },
            }
        }else {

        }
    }

    render() {
        return (

            <Provider {...stores}>
              <RootScene/>
            </Provider>


        );
    }
}
