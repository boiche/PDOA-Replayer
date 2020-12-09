<template>
  <div id="">
    <h1>Hand input</h1>
    <div id="input" class="row">
      <div class="col-2"></div>
      <div class="col-8">
        <textarea id="handInput" placeholder="Place your hand history here"></textarea>
      </div>
    </div>
    <form method="post" action="http://localhost:8080/hands/upload">
      <label class="switch">
        Anonymise
        <input type="checkbox">
        <span class="slider round"></span>
      </label>
      <input type="submit" class="btn btn-success" value="Upload"/>
    </form>

  </div>
</template>
<style>
  #handInput {
    width: 100%
  }
</style>
