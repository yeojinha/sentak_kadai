 <!-- title, and content  -->

                  <li
                    class="list-group-item px-3 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent"
                  >
                    <p class="lead fw-normal mb-0">
                      {{ item.title }}
                    </p>
                  </li>
                  <!--  -->
                  <li
                    class="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent"
                  >
                    <div class="d-flex flex-row justify-content-end mb-1">
                      <a
                        href="#!"
                        class="text-info"
                        data-mdb-toggle="tooltip"
                        title="Edit todo"
                        ><i class="fas fa-pencil-alt me-3"></i
                      ></a>
                      <a
                        href="#!"
                        class="text-danger"
                        data-mdb-toggle="tooltip"
                        title="Delete todo"
                        ><i class="fas fa-trash-alt"></i
                      ></a>
                    </div>
                    <div class="text-end text-muted">
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
                    </div>
                  </li>
                </ul>
              </div>