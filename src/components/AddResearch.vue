<template>
  <div>
    <h4>Add Research</h4>
    <div class="row gutter-sm">
      <div class="col-12">
        <q-select
          v-model="selectType"
          float-label="Research Type"
          :options="selectOptions"
          dark
        />
      </div>
      <div v-if="selectType === 'topic'" class="col-12">
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input v-model="topicTitle" float-label="Title" dark />
          </div>
          <div class="col-12">
            <q-btn color="primary" class="float-right" @click.native="addTopic">Add Topic</q-btn>
          </div>
        </div>
      </div>
    </div></div>
</template>

<script>
import { Notify } from 'quasar'

function initialState () {
  return {
    topicTitle: '',
    selectType: 'topic',
    selectOptions: [
      {
        label: 'Topic',
        value: 'topic'
      }
    ]
  }
}

export default {
  props: ['modalFin'],
  data () {
    return initialState()
  },
  methods: {
    reset () {
      console.log('reset')
      Object.assign(this.$data, initialState())
    },
    addTopic () {
      console.log('add topic')
      var topicObj = {
        title: this.topicTitle,
        users: [ this.$firebase.auth.currentUser.uid ]
      }
      console.log(topicObj)
      // this.database.add('topic', topicObj, (res) => {
      //   this.modalFin()
      //   Notify.create({
      //     message: 'Topic created!',
      //     type: 'positive',
      //     position: 'bottom-left'
      //   })
      //   this.$router.push({ name: 'topic', params: { id: res._id } })
      // })
      this.$firebase.list('topic').add(topicObj).then((res) => {
        this.modalFin()
        Notify.create({
          message: 'Topic created!',
          type: 'positive',
          position: 'bottom-left'
        })
        this.$router.push({ name: 'topic', params: { id: res.id } })
      })
    }
  }
}
</script>

<style>
</style>
