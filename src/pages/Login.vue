<template>
  <q-page padding>
    <q-card class="absolute-center" style="width:500px">
      <q-card-title align="center">
        <h4>Login</h4>
      </q-card-title>
      <q-card-main>
        <div class="row gutter-sm">
          <div class="col-12">
            <q-input
              float-label="Email"
              type="email"
              :error="$v.form.email.$error"
              v-model="form.email"
              @blur="$v.form.email.$touch"
              @keyup.enter="login"
              dark
            />
          </div>
          <div class="col-12">
            <q-input
              float-label="Password"
              type="password"
              :error="$v.form.pswd.$error"
              v-model="form.pswd"
              @blur="$v.form.pswd.$touch"
              @keyup.enter="login"
              dark
            />
          </div>
        </div>
        <br/>
        <q-btn color="primary" @click="login" label="Login" class="full-width" />
      </q-card-main>
    </q-card>
  </q-page>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { Notify, QCard, QCardTitle, QCardMain } from 'quasar'

export default {
  components: {
    QCard,
    QCardTitle,
    QCardMain
  },
  data () {
    return {
      form: {
        email: '',
        pswd: ''
      }
    }
  },
  validations: {
    form: {
      email: { required, email },
      pswd: { required }
    }
  },
  methods: {
    login () {
      console.log('login')
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Notify.create('Please review fields again.')
        return
      }
      this.firebase.auth.signInWithEmailAndPassword(this.form.email, this.form.pswd)
        .then((user) => {
          this.$router.replace('/')
        })
        .catch((err) => {
          console.error(err.message)
        })
    }
  }
}
</script>

<style>
</style>
