<template>
  <section class="vh-100">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">
          <div
            class="card"
            id="list1"
            style="border-radius: 0.75rem; background-color: #eff1f2"
          >
            <div class="card-body py-4 px-4 px-md-5">
              <p class="h1 text-center mt-3 mb-4 pb-3 text-primary">
                <i class="fas fa-check-square me-1"></i>
                <u>JOIN CHALLENGE</u>
              </p>
              <form>
                <div class="form-group">
                  <label for="title">Title</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="plz enter the title, this will be shown as your title"
                    v-model="state.formData.title"
                  />
                </div>

                <div class="form-group">
                  <label for="content">Example textarea</label>
                  <textarea
                    class="form-control"
                    id="content"
                    placeholder="event detail place"
                    rows="3"
                    v-model="state.formData.content"
                  >
                  </textarea>
                </div>
                <input
                  type="text"
                  id="typeNumber"
                  class="form-control"
                  placeholder="How many people do you want to join in your event?"
                  min="1"
                  v-model="state.formData.limit"
                  @input="handleInput"
                />
                <div>
                  <router-link to="/">
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="editItem"
                    >
                      edit
                    </button>
                  </router-link>
                </div>
              </form>
              add challenge
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter, useRoute } from "vue-router";

import { reactive, toRefs } from "vue";
import axios from "axios";

export default {
  setup() {
    // const router = useRouter();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      confirm: "",
      //  // email: router.query.email || "",
      formData: {
        id: route.query.id || "",
        limit: route.query.limit || "",
        title: route.query.title || "",
        content: route.query.content || "",
      },
      limit: "", // Add this line
    });
    const handleInput = () => {
      state.limit = state.limit.replace(/[^0-9]/g, "");
      if (state.limit.charAt(0) == "0") {
        state.limit = "";
      }
    };
    const editItem = () => {
      state.confirm = window.confirm("Do you want to edit??");
      if (state.confirm) {
        axios
          .put("api/todolist/edit/update", state.formData)
          .then((response) => {
            // Handle the response here if needed
            console.log(response.data);
            alert("Updated!!!");
            router.push("/"); // Navigate to "/" route after alert OK button is clicked
          });
      } else {
        return;
      }
    };

    const directToError = () => {
      router.push({ path: "/notfound" });
    };
    axios.get("/api/user").then((res) => {
      console.log("route.query: " + JSON.stringify(route.query));
      console.log("route.query: " + Object.keys(route.query).length);
      if (Object.keys(route.query).length <= 0) {
        //no query data
        directToError();
      }
      if (!res.data) {
        directToError();
      }
      if (res.data) {
        console.log(res.data);
      }
    });

    return {
      state,
      editItem,
      handleInput,
      router,
      directToError,
    };
  },
};
</script>
