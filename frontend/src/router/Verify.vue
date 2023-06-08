<template>
  <h1>relocate to http://localhost:8080/verify-email/</h1>
</template>

<script>
import axios from "axios";

export default {
  setup() {
    axios
      .post("/api/user/verify-email")
      .then((res) => {
        res.send();
      })
      .catch((err) => {
        console.log("verify-email: " + err);
      });
    return {};
  },
};
</script>
