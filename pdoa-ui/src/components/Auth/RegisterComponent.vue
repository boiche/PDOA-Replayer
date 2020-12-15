<template>
  <div class="mx-auto" style="width: 50%; border: double; padding: 25px">
    <h1>Register</h1>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Full name:"
        label-for="input-1"
      >
        <b-form-input
          id="input-full-name"
          v-model="form.fullName"
          type="text"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your username:" label-for="input-2">
        <b-form-input
          id="input-username"
          v-model="form.username"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Country:" label-for="input-3">
        <b-form-select
          id="input-country"
          v-model="form.country"
          :options="countries"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your password:" label-for="input-2">
        <b-form-input
          id="input-password"
          v-model="form.password"
          type="password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary" class="m-1">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
import countries from 'countries-list/dist/minimal/countries.en.min'
import AuthService from '../../services/authService.js'
export default {
  data () {
    return {
      form: {
        fullName: '',
        username: '',
        country: null,
        password: '',
        roles: ''
      },
      countries: countries,
      show: true
    }
  },
  methods: {
    onSubmit (event) {
      event.preventDefault()
      AuthService.registerUser(this.form)
    },
    onReset (event) {
      event.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.name = ''
      this.form.food = null
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  }
}
</script>
