package response

const (
	ErrorCodeSuccess      = 20001
	ErrorCodeParamInvalid = 20003
	ErrorCodeUserExists   = 20004
)

var msg = map[int]string{
	ErrorCodeSuccess:      "success",
	ErrorCodeParamInvalid: "param invalid",
	ErrorCodeUserExists:   "user exists",
}
