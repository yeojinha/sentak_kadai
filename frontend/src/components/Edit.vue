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
                <div class="form-group">
                  <label for="password">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    placeholder="Password"
                    v-model="state.formData.password"
                  />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {};
</script>
