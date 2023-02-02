import React, { Component, useState, useEffect } from 'react';
import {ImageBackground, SafeAreaView, Platform, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity,FlatList,  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";  



const Stack = createNativeStackNavigator();
const image ={uri : "https://www.myfreetextures.com/wp-content/uploads/2011/06/another-rough-old-and-worn-parchment-paper.jpg"}

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }
  const db = SQLite.openDatabase("db.db");
  return db;
}
const db = openDatabase();


function ViewCharacters ({ navigation }) {
 
  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);
 
  useEffect(() => {
    
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM roster',
        [],
        
        (tx, results) => {
         
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setItems(temp);
          
          if (results.rows.length >= 1) {
            setEmpty(false);
          
          } else {
            setEmpty(true)
            
          }
 
        }
        
      );
 
    });
  }, []);
 
  const listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000'
        }}
      />
    );
  };
 
  const emptyMSG = (status) => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
 
        <Text style={{ fontSize: 25, textAlign: 'center' }}>
          There are No Characters in your Roster
          </Text>
 
      </View>
    );
  }
 
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      {empty ? emptyMSG(empty) :
         
          <FlatList
            data={items}
            ItemSeparatorComponent={listViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
              <View key={item.id} style={{ padding: 20 }}>
 
                <Text style={styles.itemsStyle}> Name: {item.name} </Text>
               <View style={styles.row}>
               <Text > Damage: {item.dps} DPS </Text> 

              
               </View>
               
                  
               
                
              </View>
            }
          />
         
      }
      <View style={styles.container}>
      <TouchableOpacity
      style={styles.MainButton}
      onPress ={()=> {navigation.navigate('Character Creation')}}
      >
        <Text style={styles.text}>New Character</Text>
      </TouchableOpacity>  
      </View>
      </ImageBackground>
      </View>
      
    </SafeAreaView>
      
  );
      
}
 





class CreateCharacter extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      race:'Unknown',
      class:'Unknown',
      weap:'Unknown',
      equipt:'Unknown',
      spell:'Unknown',
      strength: 5,
      dexterity: 5,
      intellect: 5,
      dps: 10,
      localSound:null,
      CharacterName:null,
      forceUpdate:null,
      image:"./assets/horde.png",
    };
    this.CreateTable();
  }



 CreateTable = () =>{
  db.transaction((tx) => {
    tx.executeSql(
        "create table if not exists roster (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, dps int);",[],[],this.executeSQLErrorCallback)       
 
});
 }

  



executeSQLErrorCallback = (tx, err) => {
  console.log(err.message);
  }
 

add = (CharacterName,dps) => {
  // is text empty?
  if (CharacterName === null || CharacterName === "") {
      return false;
  }

  db.transaction(
      (tx) => {
          tx.executeSql("insert into roster (name, dps) values (?, ?)", [CharacterName, dps],[],this.executeSQLErrorCallback);
          console.log('hello');
          tx.executeSql("select * from roster", [], (_, { rows }) =>
              console.log(JSON.stringify(rows)),this.executeSQLErrorCallback
              
          );
      },
      null,
      this.state.forceUpdate
  );
};

 


   





forceUpdateId = () => {
  this.setState({ forceUpdate: useForceUpdate() });
}

  
useForceUpdate = () => {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}



 setLocalSound(newPbo) {
        this.setState({
            localSound: newPbo,
        });
    }
    
    
    async componentDidMount() {
      await this.loadSound('./assets/open.mp3', true);
     }

     loadSound = async (asset,isLocal) => {
      if (isLocal) {
          const { sound } = await Audio.Sound.createAsync(
              require('./assets/open.mp3')
          );
          this.setLocalSound(sound);
          
      }
    }
    playLocalSound = async () => {
      const { localSound } = this.state;
      await localSound.replayAsync();
  }

  setName = (CharacterName) => {
    this.setState({ CharacterName: CharacterName });
}
  setRace = (value) => {
    if (value) {
        this.setState({
            race: value,
        });
    } 
  }

  setClass = (value) => {
    if (value) {
        this.setState({
            class: value,
        });
    } 
  }

  setWeap = (value) => {
    if (value) {
        this.setState({
            weap: value,
        });
    } 
  }

  setEquipt = (value) => {
    if (value) {
        this.setState({
            equipt: value,
        });
    } 
  }

  setSpell = (value) => {
    if (value) {
        this.setState({
            spell: value,
        });
    } 
  }

buildCharacter = () => {
  


  if(this.state.race == "Strength"){
    this.setState({strength: this.state.strength +5})
  }else if (this.state.race == "Dexterity"){
  this.setState({dexterity: this.state.dexterity +5})
  }else if (this.state.race == "Intellect"){
    this.setState({intellect: this.state.intellect +5})
  }else{
    alert('please select a Race');
  }
  if(this.state.class == "StrengthClass"){
    this.setState({strength: this.state.strength +10})
  }else if (this.state.class == "DexterityClass"){
  this.setState({dexterity: this.state.dexterity +10})
  }else if (this.state.class == "IntellectClass"){
    this.setState({intellect: this.state.intellect +10})
  }else{
    alert('please select a Class');
  }
  if(this.state.weap == "StrengthWeap"){
    this.setState({strength: this.state.strength +3})
  }else if (this.state.weap == "DexterityWeap"){
  this.setState({dexterity: this.state.dexterity +3})
  }else if (this.state.weap == "IntellectWeap"){
    this.setState({intellect: this.state.intellect +3})
  }else{
    alert('please select a Weapon');
  }
  if(this.state.equipt == "StrengthEquipt"){
    this.setState({strength: this.state.strength +4})
  }else if (this.state.equipt == "DexterityEquipt"){
  this.setState({dexterity: this.state.dexterity +4})
  }else if (this.state.equipt == "IntellectEquipt"){
    this.setState({intellect: this.state.intellect +4})
  }else{
    alert('please select an Equiptment');
  }
  if(this.state.spell == "StrengthSpell"){
    this.setState({strength: this.state.strength +20})
  }else if (this.state.spell == "DexteritySpell"){
  this.setState({dexterity: this.state.dexterity +20})
  }else if (this.state.spell == "IntellectSpell"){
    this.setState({intellect: this.state.intellect +20})
  }else{
    alert('please select a Spell');
    
  }


this.setState({dps: this.state.dps + this.state.strength * this.state.dexterity + this.state.intellect })
 
}
  


  render(){
  return (
    
    <ScrollView>
    
    <View style={styles.container}>
    <ImageBackground source={require('./assets/horde.jpg')} resiseMode="cover"style = {styles.container}>
      <Text style={styles.text}> Welcome to Remoria! </Text>
      <Text style={styles.textSmall}>Customize Your Character to Start</Text>
      <TextInput
      placeholder='Character Name'
      placeholderTextColor={'white'}
      onChangeText={(CharacterName)=> this.setName(CharacterName)}
        style={styles.input}
      ></TextInput>
      <Picker
        selectedValue={this.state.race}
        onValueChange={(value, index) => this.setRace(value)}
        mode="dropdown"
        style={styles.picker}
        dropdownIconColor='white'
        >
        <Picker.Item label="Race" value="Uknown"/>
        <Picker.Item label="Orc" value="Strength"/>
        <Picker.Item label ="Elf" value ="Dexterity"/>
        <Picker.Item label ="Human" value ="Intellect"/>
        </Picker>
      
      <Picker
        selectedValue={this.state.class}
        onValueChange={(value, index) => this.setClass(value)}
        mode="dropdown"
        style={styles.picker}
        dropdownIconColor='white'
        >
        <Picker.Item label="Class" value="Uknown"/>
        <Picker.Item label="Warrior" value="StrengthClass"/>
        <Picker.Item label ="Rogue" value ="DexterityClass"/>
        <Picker.Item label ="Mage" value ="IntellectClass"/>
        </Picker>
     
      <Picker
        selectedValue={this.state.weap}
        onValueChange={(value, index) => this.setWeap(value)}
        mode="dropdown"
        style={styles.picker}
        dropdownIconColor='white'
        >
        <Picker.Item label="Weapon" value="Uknown"/>
        <Picker.Item label="Sword and Shield" value="StrengthWeap"/>
        <Picker.Item label ="Dual Wielding Daggers" value ="DexterityWeap"/>
        <Picker.Item label ="Frost Staff" value ="IntellectWeap"/>
        </Picker>
   
      <Picker
        selectedValue={this.state.equipt}
        onValueChange={(value, index) => this.setEquipt(value)}
        mode="dropdown"
        style={styles.picker}
        dropdownIconColor='white'
        >
        <Picker.Item label="Equiptment" value="Uknown"/>
        <Picker.Item label="Mail Curass" value="StrengthEquipt"/>
        <Picker.Item label ="Cloak of Shadows" value ="DexterityEquipt"/>
        <Picker.Item label ="Amulet of The Elements" value ="IntellectEquipt"/>
        </Picker>
    
      <Picker
        selectedValue={this.state.spell}
        onValueChange={(value, index) => this.setSpell(value)}
        mode="dropdown"
        style={styles.picker}
        dropdownIconColor='white'
        >
        <Picker.Item label="Spell" value="Uknown"/>
        <Picker.Item label="Berserk" value="StrengthSpell"/>
        <Picker.Item label ="Evasion" value ="DexteritySpell"/>
        <Picker.Item label ="Combustion" value ="IntellectSpell"/>
        </Picker>
      <TouchableOpacity
      style={styles.MainButton}
      onPress={() => {this.buildCharacter();this.playLocalSound();}}
     >
        <Text style={styles.text}>Create Character</Text>
      </TouchableOpacity>
      <Text style={styles.textName}>{this.state.CharacterName}</Text>
      <Text style={styles.text}>Your Stats</Text>
      <Text style={styles.textSmallStats}><Text style={styles.textStrength}>Strength={this.state.strength}</Text>  Dexterity={this.state.dexterity}  Intellect={this.state.intellect}</Text>
      <Text style={styles.text}>Your Potential Damage</Text>
      <Text style={styles.textDamage}>{this.state.dps} DPS</Text>

      <TouchableOpacity
      style={styles.MainButton}
      onPress ={()=> {this.add(this.state.CharacterName,this.state.dps)}}
      >
        <Text style={styles.text}>Save Character</Text>
      </TouchableOpacity>
   
      


      <TouchableOpacity
      style={styles.MainButton}
      onPress={()=>{ this.props.navigation.navigate('Character Roster')} }
      >
        <Text style={styles.text}>View Character Roster</Text>
      </TouchableOpacity>
      </ImageBackground>
    </View>
    
    </ScrollView>
    
  );
}

}




export default class App extends Component {
  constructor(props){
      super(props);
  }

  
  render() {
      return (
          <NavigationContainer>
              <Stack.Navigator>
                  
                  <Stack.Screen
                      name="Character Creation"
                      component={CreateCharacter}
                      options={{
                        headerStyle: {
                          backgroundColor:'red'
                        }
                      }}
                  />
                  <Stack.Screen
                      name="Character Roster"
                      component={ViewCharacters}
                      options={{
                        headerStyle: {
                          backgroundColor:'red'
                        }
                      }}
                  />
                
              </Stack.Navigator>
          </NavigationContainer>
      );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: null,
    height: null,
    
  },
  text: {
      fontSize: 24,
      color: 'white'
  },
  textName: {
    fontSize: 32,
    color: 'white',
    textDecorationLine: 'underline'
},
  textDamage: {
    fontSize: 24,
    color: 'red'
},
  textSmall: {
    fontSize: 18,
    color: 'white'
},
textSmallStats: {
  fontSize: 18,
  color: '#53eb07'
},


  picker: {
      marginVertical: 15,
      width: 300,
      padding: 10,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: 'white',
      color: 'white',
      
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  input: {
    borderColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    width: 300,
    margin: 16,
    padding: 8,
    fontSize: 18,
    color: 'white',
    
  },
  row: {
    flexDirection: 'row',
    
  },
  Delete: {
    margin: 25,
    width: 150,
    backgroundColor: 'red',
    height: 60,
    borderRadius: 10,  
  },
  MainButton: {
    margin: 25,
    width: 300,
    backgroundColor: 'red',
    height: 60,
    borderRadius: 10,
    borderWidth:1,
    borderColor:'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  BottomButton: {
    right: 10,
    left: 10,
    position: 'absolute',
    bottom: 10,
    margin: 25,
    width: 300,
    backgroundColor: 'red',
    height: 60,
    borderRadius: 10,
    borderWidth:1,
    borderColor:'white',
  }
 

});
