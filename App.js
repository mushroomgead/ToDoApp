/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  FlatList,
  Button,
  TextInput,
} from 'react-native';

type Props = {};

export default class App extends Component<Props> {

  state = {
    tasks: [],
  };

  componentDidMount() {
    AsyncStorage.getItem('tasks', (err, data) => {
      if (data) {
        this.setState({ tasks: JSON.parse(data) })
      }
    });
  }

  persistData() {
    AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks))
  }

  onChange(name, val) {
    this.setState({ [name]: val })
  }

  addTask = () => {
    let { tasks, text } = this.state;
    const notEmpty = text.trim().length > 0

    if (notEmpty) {
      this.setState({
        tasks: tasks.concat({
          id: Math.floor(Math.random() * 100) + 1,
          title: text,
          description: '',
          date: new Date().toLocaleTimeString(),
          isDone: false,
          showDetail: false,
        }),
        text: ''
      }, () => this.persistData())
    } else {
      window.alert('Please add task!')
    }
  }

  modifyTask(item, flag) {
    let { tasks } = this.state;
    let task = tasks.filter(v => v.id === item.id)[0];
    task[flag] = !task[flag];
    this.setState({ tasks }, () => this.persistData())
  }

  deleteTask(item) {
    let tasks = this.state.tasks.filter(v => v.id !== item.id);
    this.setState({ tasks }, () => this.persistData())
  }

  onSaveDescription() {
    window.alert('Saved!')
    this.persistData()
  }

  onChangeText(name, item, value) {
    let { tasks } = this.state;
    let task = tasks.filter(v => v.id === item.id)[0];
    task[name] = value
    task['date'] = new Date().toLocaleTimeString()
    this.setState({ tasks })
  }

  _keyExtractor = (item, index) => String(item.id);

  renderItem = ({ item, index }) => {
    const checkIsDone = item.isDone && { textDecorationLine: 'line-through' };
    return <View>
      <View style={styles.containerList}>
        <Text style={[styles.listItem, checkIsDone]}>
          {item.title}
        </Text>
        <Button title='Edit' color='#ffc107' onPress={() => this.modifyTask(item, 'showDetail')} />
        <Button title='Done' onPress={() => this.modifyTask(item, 'isDone')} />
        <Button title='Delete' color='#dc3545' onPress={() => this.deleteTask(item)} />
      </View>
      {item.showDetail && <View style={styles.containerDetail}>
        <View style={styles.header}>
          <Text>ID: {item.id}</Text>
          <Text>Date: {item.date}</Text>
        </View>
        <View style={styles.inputGroup}>
          <Text>Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder='title'
            returnKeyType='done'
            underlineColorAndroid='rgba(0,0,0,0)'
            value={item.title}
            onChangeText={(val) => this.onChangeText('title', item, val)}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder='description'
            returnKeyType='done'
            underlineColorAndroid='rgba(0,0,0,0)'
            value={item.description}
            onChangeText={(val) => this.onChangeText('description', item, val)}
          />
        </View>
        <Button title='Save' onPress={() => this.onSaveDescription(item)} />
      </View>}
    </View>
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerButton}>
          <TextInput
            style={styles.textInput}
            placeholder='Add task'
            returnKeyType='done'
            underlineColorAndroid='rgba(0,0,0,0)'
            value={this.state.text}
            onChangeText={(val) => this.onChange('text', val)}
          />
          <Button title='Add' color="#28a745" onPress={this.addTask} />
        </View>
        <FlatList
          style={styles.itemList}
          data={this.state.tasks}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
  },
  containerButton: {
    flexDirection: 'row',
    padding: 30,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#9e9e9e',
    borderWidth: 1,
    paddingRight: 6,
    paddingLeft: 6,
    borderRadius: 3,
  },
  containerList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemList: {
    width: '100%'
  },
  containerDetail: {
    backgroundColor: '#fffbed',
    padding: 15,
  },
  header: {
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#9e9e9e',
  },
  inputGroup: {
    marginBottom: 10,
  }
});
