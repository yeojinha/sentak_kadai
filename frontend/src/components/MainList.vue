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
              <!-- add challenge -->
              <form>
                <div class="form-group">
                  <label for="formDate.email">Email address</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="name@example.com"
                    v-model="state.formData.email"
                  />
                </div>
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
                  ></textarea>
                </div>
                <div>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="addItem()"
                  >
                    Add
                  </button>
                </div>
              </form>
              <!--add challenge  -->

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
              <!--  ul Challenge List -->
              <div>
                <div class="card" v-for="item in state.list" :key="item.id">
                  <section class="card-header" id="headingOne">
                    <h5 class="mb-0">
                      <li
                        class="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent"
                      >
                        <section
                          class="d-flex flex-row justify-content-end mb-1"
                        >
                          <button
                            class="button-11"
                            role="button"
                            data-mdb-toggle="tooltip"
                            title="Edit todo"
                            @click="editItem(item.id)"
                          >
                            <i class="fas fa-pencil-alt me-3"></i>
                          </button>
                          <button
                            class="button-11"
                            role="button"
                            data-mdb-toggle="tooltip"
                            title="Delete todo"
                            @click="deleteItem(item.id)"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </section>
                        <section class="text-end text-muted">
                          <a
                            href="#!"
                            class="text-muted"
                            data-mdb-toggle="tooltip"
                            title="Created date"
                          >
                            <p class="small mb-0">
                              <i class="fas fa-info-circle me-2"></i
                              >{{ item.createdAt }}
                            </p>
                          </a>
                        </section>
                      </li>
                      <button
                        class="btn btn-link"
                        data-toggle="collapse"
                        data-target="#collapseOne"
                        aria-expanded="false"
                        aria-controls="collapseOne"
                        @click="hideCardBody(item.id)"
                      >
                        <h3>{{ item.title }}</h3>
                      </button>
                    </h5>
                  </section>

                  <div
                    id="collapseOne"
                    class="collapse show"
                    aria-labelledby="headingOne"
                    data-parent="#accordion"
                  >
                    <!-- <div class="card-body d-none"> -->
                    <div
                      class="'card-body' + item.id"
                      :class="{ 'd-none': item.isActive }"
                    >
                      {{ item.content }}
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
    const cardBody = null;
    const state = reactive({
      //
      selected_category: "",
      selected_date: "",
      list: [],
      isNone: true,
      userName: "",
      //
      formData: {
        id: "",
        title: "",
        content: "",
        createdAt: "",
        userName: "",
        isActive: true,
      },
    });
    //time set method
    const getToday = () => {
      let date = new Date();
      let year = date.getFullYear();
      let month = ("0" + (1 + date.getMonth())).slice(-2);
      let day = ("0" + date.getDate()).slice(-2);
      return year + "/" + month + "/" + day;
    };

    // methdos

    //edit
    const editItem = (id) => {
      if (!state.userName || state.userName == "") {
        alert("Plz Login first!");
        return;
      }
      console.log("edit -> state.item.id : " + id);
    };

    //delete
    const deleteItem = (id) => {
      // if (!state.userName || state.userName == "") {
      //   alert("You aren;t !");
      //   return;
      // }
      const targetItem = state.list.find((el) => el.id == id);
      console.log("target Item : " + JSON.stringify(targetItem));
      console.log("state.userName: " + state.userName);
      if (state.userName !== targetItem.userName) {
        //if cnt user has no right to delete the content return;
        alert("You aren't authorized to delete this content.");
        return;
      }
      const contentData = {
        name: targetItem.userName,
        id: targetItem.id,
      };
      console.log("contentData: " + JSON.stringify(contentData));
      axios
        .delete(`/api/todolist/delete`, {
          data: contentData,
        })
        .then((res) => {
          console.log("res.data by delete: " + JSON.stringify(res.data.list));
          state.list = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    //add
    const addItem = () => {
      console.log("addItem on adding content isId-> " + state.userName);
      if (!state.userName || state.userName == "") {
        alert("Plz Login first!");
        return;
      }
      state.formData.createdAt = getToday();
      state.formData.id = new Date().getTime(); //create id
      state.formData.userName = state.userName;
      const formData = state.formData;
      console.log("add formData-> " + JSON.stringify(formData));
      axios
        .post("/api/todolist/add", formData)
        .then((res) => {
          state.list = res.data;
          console.log("res.data by post: " + JSON.stringify(res.data));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          state.formData.id = "";
          state.formData.email = "";
          state.formData.title = "";
          state.formData.content = "";
          state.formData.createdAt = "";
          state.formData.userName = "";
          state.userName = "";
          //clear input
        });
    };
    //hide and show button

    const hideCardBody = (id) => {
      const found = state.list.find((el) => el.id == id);
      console.log("Before hideCardBody isActive: " + found.isActive);
      found.isActive = !found.isActive;
      console.log("After hideCardBody isActive: " + found.isActive);
      const isActive = found.isActive;
      axios
        .put("/api/todolist", {
          isActive,
          id,
        })
        .then((res) => {
          state.list = res.data.list;

          console.log("res.data by get: " + JSON.stringify(res.data.list));
        });
    };

    //show
    axios.get("/api/todolist/show").then((res) => {
      console.log(
        "front mainList.vue user token check: " + JSON.stringify(res.data)
      );
      if (res.data.user) {
        console.log(
          "front if(res.data.user): " + JSON.stringify(res.data.user)
        );
        state.list = res.data.list;
        state.userName = res.data.user.user.info.name;
      } else {
        console.log("front if(!res.data.user)" + JSON.stringify(res.data));
        state.list = res.data;
      }

      console.log("mainList.vue: " + JSON.stringify(state.list));
    });

    return { state, addItem, deleteItem, editItem, hideCardBody };
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
.hide {
  visibility: hidden;
}
// <button class="button-11" role="button">Button 11</button>

/* CSS */
.button-11 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Roboto", sans-serif;
  border-radius: 6px;
  color: #3d3d3d;
  background: #fff;
  border: none;
  box-shadow: 0px 0.5px 1px rgba(0, 0, 0, 0.1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-11:focus {
  box-shadow: 0px 0.5px 1px rgba(0, 0, 0, 0.1),
    0px 0px 0px 3.5px rgba(58, 108, 217, 0.5);
  outline: 0;
}
// const hideCardBody = (event) => {
//   const cardBody = event.target
//     .closest(".card")
//     .querySelector(".card-body");
//   cardBody.classList.toggle("d-none");
// };
// ///axios
</style>
