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
                <i class="fas fa-check-square me-1">Click ->&nbsp;&nbsp;</i>
                <i
                  class="fas fa-check-square me-1"
                  type="button"
                  @click="switchTitle()"
                  >{{ state.title }}</i
                >
              </p>

              <div>
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
                            @click="hideCardBody(item.id)"
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
                          <button
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
                        { 'd-none': item.isActive },
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
      flag: true,
      title: "MY CHALLENGES",
      joinEvent: [], //cookie 에서 user data 뽑고, participants table에서 그유저가 참여중인 event 목록 대입 -> id있으면 join버튼 색깔 or 변화주기
      confirm: "",
      targetItem: "",
      selected_category: "",
      selected_date: "",
      list: [],
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

    const switchTitle = () => {
      state.flag = !state.flag;
      if (state.flag) state.title = "MY CHALLENGES";
      else state.title = "JOINED CHALLENGES";
      console.log("flag: " + state.flag);
      showContents();
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
      //inside this method,
      /**
       * 0. 유저 로그인 상태, 클릭 시
       * 1. 현재 클릭한 이벤트 대상 targetItem에 대입
       * 2. 체크(유저 로그인상태인가?) true 3으로 false -> return
       * 3. axios.get(현재 유저name 현재 targetEventId) -> participant_events에서 현 userName, 현 eventId  있는지 가져오기
       * 4. Server Side -> sql로 if(event id && userName in participants_events) -> if(found) true(존재)
       * 4-1. app.delete(현재 유저정보, 이벤트id) -> participants_events에서 해당하는 data 삭제
       * 4-2. app.put(event id)-> contents 에서 participants -1하기
       * 4-2. 현 아이템 state.list[now].hasJoined=false;
       * 5. if(현재 유저가 신규 유저가 될 것이라면) -> if(found.length<0)
       * 5-1. axios.put(현재 유저정보, 이벤트id) -> participants_events에서 data 추가
       * 5-2. axios.put(content id)-> contents에서 participants +1하기
       * 5-3. 현 아이템 state.list[now].hasJoined=true;
       */
      // 2ways -> hasJoined false and true

      state.targetItem = await state.list.find((el) => el.id == id); //1
      console.log("join target Item : " + JSON.stringify(state.targetItem));
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
      console.log("join state.userName: " + state.userName);
      let tempNum = 1;
      tempNum = parseInt(state.targetItem.participants);

      if (
        parseInt(state.targetItem.limit) <= tempNum &&
        !state.targetItem.hasJoined
      ) {
        alert("Room is full");
        return;
      }
      if (
        !state.targetItem.hasJoined &&
        parseInt(state.targetItem.limit) > tempNum
      )
        state.confirm = window.confirm(
          "Are you going to participate in this event ?"
        );
      else {
        state.confirm = window.confirm("Are you canceling your participation?");
      }
      if (state.confirm) {
        axios
          .put("/api/todolist/participants_events", user)
          .then(async (res) => {
            console.log("res.data.list: " + JSON.stringify(res.data));
            // state.list = res.data;

            for (let i = 0; i < state.list.length; i++) {
              console.log("for문 진입?");
              state.list[i].participants = res.data[i].participants;
              if (
                state.list[i].id == state.targetItem.id &&
                state.list[i].hasJoined == true
              ) {
                console.log("if?");
                state.list[i].hasJoined = false;
              } else if (
                state.list[i].id == state.targetItem.id &&
                state.list[i].hasJoined == false
              ) {
                console.log("else if?");
                state.list[i].hasJoined = true;
              }
            }
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
          .then((res) => {
            console.log("res.data by delete: " + JSON.stringify(res.data));
            state.list = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return;
      }
    };

    const hideCardBody = async (id) => {
      // alert("clicked id: " + id);
      const found = await state.list.find((el) => el.id == id);
      // alert("Before hideCardBody isActive: " + found.isActive);
      found.isActive = !found.isActive;
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
            axios
              .get("/api/todolist/my_page_joined", { params: { userName } })
              .then((res) => {
                console.log(
                  "my_page_joined front: " + JSON.stringify(res.data.list)
                );
                state.list = res.data.list;
              });
          } else if (state.flag) {
            console.log("changed!!!!");
            axios
              .get("/api/todolist/my_challenges", { params: { userName } })
              .then((res) => {
                state.list = res.data.list;
              });
          }
        } else {
          state.list = null;
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
  border-color: transparent;
  box-shadow: none;
}
#list1 .select-input.form-control[readonly]:not([disabled]) {
  background-color: #fbfbfb;
}
.hide {
  visibility: hidden;
}
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
</style>
