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
                  <label for="exampleFormControlInput1">Email address</label>
                  <input
                    type="email"
                    class="form-control"
                    id="exampleFormControlInput1"
                    placeholder="name@example.com"
                  />
                </div>
                <div class="form-group">
                  <label for="exampleFormControlSelect1">Title</label>
                  <input
                    type="text"
                    class="form-control"
                    id="exampleFormControlSelect1"
                    placeholder="plz enter the title, this will be shown as your title"
                  />
                </div>

                <div class="form-group">
                  <label for="exampleFormControlTextarea1"
                    >Example textarea</label
                  >
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    placeholder="event detail place"
                    rows="3"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <button type="button" class="btn btn-primary" @click="add()">
                    Add
                  </button>
                </div>
              </form>

              <hr class="my-4" />

              <div
                class="d-flex justify-content-end align-items-center mb-4 pt-2 pb-3"
              >
                <p class="small mb-0 me-2 text-muted">Filter</p>
                <select class="select" v-model="state.selected_category">
                  <option v-for="(item, index) in state.data" :key="index">
                    {{ item }}
                  </option>
                </select>
                <p class="small mb-0 ms-4 me-2 text-muted">Sort</p>
                <select class="select" v-model="state.selected_date">
                  <option value="1">Added date</option>
                  <option value="2">Due date</option>
                </select>
                <a
                  href="#!"
                  style="color: #23af89"
                  data-mdb-toggle="tooltip"
                  title="Ascending"
                  ><i class="fas fa-sort-amount-down-alt ms-2"></i
                ></a>
              </div>

              <div>
                <div class="card">
                  <div class="card-header" id="headingOne">
                    <h5 class="mb-0">
                      <button
                        class="btn btn-link"
                        data-toggle="collapse"
                        data-target="#collapseOne"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                      >
                        dddddddddd
                      </button>
                    </h5>
                  </div>

                  <div
                    id="collapseOne"
                    class="collapse show"
                    aria-labelledby="headingOne"
                    data-parent="#accordion"
                  >
                    <div class="card-body">
                      asdasddddddddddddddddddddddddddddddddddd
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { reactive } from "vue";
import axios from "axios";
export default {
  setup() {
    const state = reactive({
      data: [],
      selected_category: "",
      selected_date: "",
      list: [],
    });

    // methdos

    const add = () => {};

    ///axios
    axios.get("/api/todolist").then((res) => {
      state.list = res.data;
      console.log(state.list);
    });

    return { state };
  },
};
</script>

<style lang="scss">
#list1 .form-control {
  border-color: transparent;
}
#list1 .form-control:focus {
  border-color: transparent;
  box-shadow: none;
}
#list1 .select-input.form-control[readonly]:not([disabled]) {
  background-color: #fbfbfb;
}
</style>
