<template>
  <Header />
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
                <i
                  class="fas fa-check-square me-1"
                  style="color: mediumseagreen"
                  >Click ->&nbsp;&nbsp;</i
                >
                <i
                  class="fas fa-check-square me-1"
                  type="button"
                  style="color: mediumseagreen"
                  @click="switchTitle()"
                  >{{ state.title }}</i
                >
              </p>

              <div v-if="!state.flag">
                <div
                  class="card"
                  v-for="item in state.joinedList"
                  :key="item.id"
                >
                  <section class="card-header" :id="'headingOne-' + item.id">
                    <h5 class="mb-0">
                      <li
                        class="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent"
                      >
                        <section
                          class="d-flex flex-row justify-content-end mb-1"
                        >
                          <button
                            class="btn btn-link"
                            data-toggle="collapse"
                            :data-target="'#collapseOne-' + item.id"
                            aria-expanded="false"
                            style="color: mediumseagreen"
                            :aria-controls="'collapseOne-' + item.id"
                            @click="hideCardBody(item)"
                          >
                            <h4>{{ item.title }}</h4>
                          </button>
                          <!-- if hasJoined fasle showing join button -->

                          <!-- else don't show join button -->
                          <button
                            v-if="!state.flag"
                            class="button-11"
                            role="button"
                            data-mdb-toggle="tooltip"
                            title="join todo"
                            @click="join(item.id)"
                          >
                            Already Joined!!!
                          </button>
                          <!-- <button
                            v-else
                            class="button-11"
                            role="button"
                            data-mdb-toggle="tooltip"
                            title="join todo"
                          >
                            Your room
                          </button>
                          <button
                            v-if="
                              state.userName != undefined &&
                              state.userName != '' &&
                              state.userName == item.userName &&
                              state.flag
                            "
                            class="button-11"
                            role="button"
                            data-mdb-toggle="tooltip"
                            title="Edit todo"
                            @click="editItem(item)"
                          >
                            <router-link
                              :to="{
                                name: 'Edit',
                                query: {
                                  id: item.id,
                                  limit: item.limit,
                                  title: item.title,
                                  content: item.content,
                                },
                              }"
                            >
                              <i class="fas fa-pencil-alt"></i>
                            </router-link>
                          </button>
                          <button
                            v-if="state.flag"
                            class="button-11"
                            role="button"
                            data-mdb-toggle="tooltip"
                            title="Delete todo"
                            @click="deleteItem(item.id)"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </button> -->
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
                              <i class="fas fa-info-circle me-2"></i>
                              <span v-if="item.participants === ''">{{
                                0
                              }}</span>
                              <span v-else>{{ item.participants }}</span> /
                              {{ item.limit }}
                            </p>
                          </a>
                        </section>
                      </li>
                    </h5>
                  </section>

                  <div
                    :id="'collapseOne-' + item.id"
                    class="collapse show"
                    aria-labelledby="'headingOne-'+item.id"
                  >
                    <!-- <div class="card-body d-none"> -->
                    <div
                      :class="[
                        'card-body-' + item.id,
                        {
                          'd-none': item.isActive || item.isActive == undefined,
                        },
                      ]"
                    >
                      <h4>{{ item.content }}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="card" v-for="item in state.list" :key="item.id">
                  <section class="card-header" :id="'headingOne-' + item.id">
                    <h5 class="mb-0">
                      <li
                        class="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent"
                      >
                        <section
                          class="d-flex flex-row justify-content-end mb-1"
                        >
                          <button
                            class="btn btn-link"
                            data-toggle="collapse"
                            :data-target="'#collapseOne-' + item.id"
                            aria-expanded="false"
                            :aria-controls="'collapseOne-' + item.id"
                            style="color: mediumseagreen"
                            @click="hideCardBody(item)"
                          >
                            <h4>{{ item.title }}</h4>
                          </button>
                          <!-- if hasJoined fasle showing join button -->

                          <!-- else don't show join button -->
                          <!-- <button
                            v-if="!state.flag"
                            class="button-11"
                            role="button"
                            data-mdb-toggle="tooltip"
                            title="join todo"
                            @click="join(item.id)"
                          >
                            Already Joined!!!
                          </button> -->
                          <button
                            class="button-11"
                            role="button"
                            data-mdb-toggle="tooltip"
                            title="join todo"
                          >
                            Your room
                          </button>
                          <button
                            v-if="
                              state.userName != undefined &&
                              state.userName != '' &&
                              state.userName == item.userName &&
                              state.flag
                            "
                            class="button-11"
                            role="button"
                            data-mdb-toggle="tooltip"
                            title="Edit todo"
                            @click="editItem(item)"
                          >
                            <router-link
                              :to="{
                                name: 'Edit',
                                query: {
                                  id: item.id,
                                  limit: item.limit,
                                  title: item.title,
                                  content: item.content,
                                },
                              }"
                            >
                              <i
                                class="fas fa-pencil-alt"
                                style="color: mediumseagreen"
                              ></i>
                            </router-link>
                          </button>
                          <button
                            v-if="state.flag"
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
                              <i class="fas fa-info-circle me-2"></i>
                              <span v-if="item.participants === ''">{{
                                0
                              }}</span>
                              <span v-else>{{ item.participants }}</span> /
                              {{ item.limit }}
                            </p>
                          </a>
                        </section>
                      </li>
                    </h5>
                  </section>

                  <div
                    :id="'collapseOne-' + item.id"
                    class="collapse show"
                    aria-labelledby="'headingOne-'+item.id"
                  >
                    <!-- <div class="card-body d-none"> -->
                    <div
                      :class="[
                        'card-body-' + item.id,
                        {
                          'd-none': item.isActive || item.isActive == undefined,
                        },
                      ]"
                    >
                      <h4>{{ item.content }}</h4>
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
import { useRouter } from "vue-router";
import { reactive, toRefs } from "vue";
import Header from "../components/Header.vue";
import axios from "axios";
export default {
  components: {
    Header,
  },
  setup() {
    const router = useRouter();

    const state = reactive({
      flag: "",
      title: "",
      joinEvent: [], //cookie 에서 user data 뽑고, participants table에서 그유저가 참여중인 event 목록 대입 -> id있으면 join버튼 색깔 or 변화주기
      confirm: "",
      targetItem: "",
      selected_category: "",
      selected_date: "",
      list: [],
      joinedList: [],
      str: [],
      userName: "",
      // tempLimit: 0,

      formData: {
        id: "",
        title: "",
        content: "",
        createdAt: "",
        userName: "",
        participants: "",
        limit: "",
        hasJoined: "", //by giving this false showing yetJoined Button,
        isActive: true,
      },
    });
    const { list, joinedList } = toRefs(state);

    const switchTitle = () => {
      state.flag = !state.flag;

      console.log("flag: " + state.flag);
      showContents(state.flag);
    };
    //edit
    const editItem = (item) => {
      router.push({
        name: "Edit",
        query: {
          id: item.id,
          limit: item.limit,
          title: item.title,
          content: item.content,
        },
      });
    };
    //-----------------------------join_cancel---------------------
    const join = async (id) => {
      state.targetItem = await state.joinedList.find((el) => el.id == id); //1

      const user = {
        //user data, event id
        name: state.userName,
        id: state.targetItem.id,
      };
      if (state.userName === "") {
        //2
        alert("plz login first");
        return;
      }
      // tempNum = parseInt(state.targetItem.participants);

      state.confirm = window.confirm("Are you canceling your participation?");
      if (state.confirm) {
        axios
          .put("/api/todolist/participants_events", user)
          .then(async (res) => {
            const idx = state.joinedList.indexOf(state.targetItem);
            console.log("join: idx:" + idx);
            state.joinedList.splice(idx, 1);
          });
      }
    };
    //--------------------------join-----------------------------
    //delete
    const deleteItem = async (id) => {
      state.targetItem = await state.list.find((el) => el.id == id);
      if (state.userName === "") {
        alert("plz login first");
        return;
      } else if (state.userName !== state.targetItem.userName) {
        //if cnt user has no right to delete the content return;
        alert("You aren't authorized to delete this content.");
        return;
      }
      state.confirm = window.confirm("Do you really want to delete?");
      if (state.confirm) {
        const contentData = {
          name: state.targetItem.userName,
          id: state.targetItem.id,
        };
        console.log("contentData: " + JSON.stringify(contentData));
        axios
          .delete(`/api/todolist/delete`, {
            data: contentData,
          })
          .then(async (res) => {
            console.log(
              " before state.list by delete: " + JSON.stringify(state.list)
            );

            const idx = state.list.indexOf(state.targetItem);

            console.log("delete: idx:" + idx);
            state.list.splice(idx, 1);
            console.log(
              "after state.list by delete: " + JSON.stringify(state.list)
            );
            // list.value.forEach((el) => console.log("el: " + el));
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return;
      }
    };

    const hideCardBody = async (item) => {
      // alert("clicked id: " + id);
      // const found = await state.list.find((el) => el.id == id);
      // alert("Before hideCardBody isActive: " + JSON.stringify(item));
      item.isActive = !item.isActive;
      // console.log("hideCardBody found data: " + JSON.stringify(found));
      state.list.forEach((el) =>
        console.log("id: " + el.id + "     isActive: " + el.isActive)
      );
    };
    const findMyContents = (arr1, name) => {
      return arr1.filter((el) => name == el.userName);
    };
    const showContents = () =>
      axios.get("/api/todolist/getUser").then((resUser) => {
        if (resUser.data.user) {
          state.userName = resUser.data.user.info.name;
          const userName = resUser.data.user.info.name;
          if (!state.flag) {
            state.title = "JOINED CHALLENGES";
            axios
              .get("/api/todolist/my_page_joined", { params: { userName } })
              .then(async (res) => {
                console.log(
                  "my_page_joined front: " + JSON.stringify(res.data.list)
                );
                joinedList.value = await res.data.list;
                for (let el of state.joinedList) {
                  console.log("joined List: " + JSON.stringify(el));
                }
              });
          } else if (state.flag) {
            state.title = "MY CHALLENGES";
            console.log("changed!!!!");
            axios
              .get("/api/todolist/my_challenges", { params: { userName } })
              .then(async (res) => {
                list.value = await res.data.list;
                for (let el of state.list) {
                  console.log("created ist: " + JSON.stringify(el));
                }
              });
          }
        } else {
          //token expired
          console.log("token expired!");
          router.push("/");
        }
      });
    showContents();
    return {
      state,
      router,
      join,
      deleteItem,
      editItem,
      hideCardBody,
      switchTitle,
      showContents,
      findMyContents,
    };
  },
};
</script>

<style lang="scss">
#list1 .form-control {
  border-color: transparent;
}
#list1 .form-control:focus {
  //when input textarea
  border-color: rgb(20, 180, 92);
  box-shadow: none;
}

#list1 .select-input.form-control[readonly]:not([disabled]) {
  background-color: black;
}

.hide {
  visibility: visible;
}

// <button class="button-11" role="button">Button 11</button>

/* CSS */

.form-group {
  font-size: 20px;
  height: 150%;
}

.add-button {
  // addbutton in form
  transform: scale(1.3);
  padding-left: 130px;
}

.card-body {
  //text in card
  font-size: 25px;
}

.btn {
  //list button
  border: solid thin rgb(20, 180, 92);
  color: white;
  background-color: white;
}

.btn:hover {
  //mouseover list button
  background-color: rgb(196, 236, 214);
  border: rgb(20, 180, 92);
}

.card-header {
  //all border of card
  border: solid thin #eff1f2;
}

.collapsearea {
  //pulldown list view
  border: solid thin #eff1f2;
}

.list-group-item {
  color: black;
}

.showdownlist {
  font-size: 20px;
  color: black;
}

.linebetweenformandlist {
  color: black;
}

.button-11 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Roboto", sans-serif;
  border-radius: 6px;
  color: #000000;
  background: #fff;
  border: none;
  box-shadow: 0px 0.5px 1px rgba(0, 0, 0, 0.1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-11:focus {
  box-shadow: 0px 0.5px 1px rgba(0, 0, 0, 0.1),
    0px 0px 0px 3.5px rgb(20, 180, 92);
  outline: 0;
}
</style>
