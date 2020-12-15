<template>
  <div id="nav">
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="/">PDOA</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/replay/">PDOA Replayer</b-nav-item>
          <b-nav-item disabled>Forum</b-nav-item>
          <b-nav-item disabled>Odds Analyser</b-nav-item>
          <b-nav-item disabled>Offers</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="/en">EN</b-dropdown-item>
            <b-dropdown-item href="/bg">BG</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="/register">Register</b-dropdown-item>
            <b-dropdown-item href="/login">Login</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
