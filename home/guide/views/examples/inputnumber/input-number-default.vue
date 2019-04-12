<template>
  <div>
    <div class="input-demo">
      <h5> # Normal </h5>
      <div class="input-inner-width">
        <div>
          <ev-input
            :value="2"
          />
        </div>
        <h5> # Disable </h5>
        <div>
          <ev-input
            :value="3"
            :disabled="true"
          />
        </div>
        <h5> # Read Only </h5>
        <div>
          <ev-input
            :value="2"
            :readonly="true"
          />
        </div>
      </div>
      <h5> # Variation </h5>

      <div class="input-demo-multi">
        <ev-input
          :readonly="true"
          :value="0.5"
          width="30%"
        />
        <ev-input
          :readonly="true"
          :value="-0.5"
          width="30%"
        />
      </div>
      <div>
        <ev-input
          :value="Infinity"
          width="70%"
        />
      </div>
      <div>
        <ev-input
          :value="-Infinity"
          width="120%"
        />
      </div>
      <h5> # Step </h5>

      <div class="input-inner-width">
        <div>
          <ev-input
            :step="12"
            :value="50"
          >``
          </ev-input>
          <p> step: 12</p>
        </div>
        <div>
          <ev-input
            :value="2.021"
            :precision="4"
            :step="0.01"
          >``
          </ev-input>
          <p> step: 0.01</p>
        </div>
        <div>
          <ev-input
            :value="-0.021"
            :precision="4"
            :step="0.0011"
          >``
          </ev-input>
          <p> step: 0.0011</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
      };
    },
  };
</script>
<style scoped>
  div{
    padding: 3px;
  }
  p{
    margin: 2px;
  }
  .input-demo {
    width: 30%;
  }
  .input-demo-multi {
    display: inline-block;
  }
  .input-inner-width {
    width: 60%;
  }
</style>
