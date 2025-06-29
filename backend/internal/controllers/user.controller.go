package controllers

import (
	"net/http"
	"strconv"

	"github.com/RustPyGo/hackathon-education-system/backend/internal/models"
	"github.com/RustPyGo/hackathon-education-system/backend/internal/services"
	"github.com/RustPyGo/hackathon-education-system/backend/pkg/response"
	"github.com/gin-gonic/gin"
)

type UserController struct {
	userService services.IUserService
}

func NewUserController(userService services.IUserService) *UserController {
	return &UserController{
		userService: userService,
	}
}

// CreateUser godoc
// @Summary Create a new user
// @Description Create a new user account
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.User true "User information"
// @Success 201 {object} response.Response{data=models.User}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /user/ [post]
func (uc *UserController) CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if uc.userService.CheckUserExists(user.Email) {
		response.ErrorResponse(c, http.StatusConflict, "User already exists")
		return
	}

	if err := uc.userService.CreateUser(&user); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to create user")
		return
	}

	response.SuccessResponse(c, http.StatusCreated, user)
}

// GetUserByID godoc
// @Summary Get user by ID
// @Description Get detailed information of a user by their ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} response.Response{data=models.User}
// @Failure 404 {object} response.Response
// @Router /user/{id} [get]
func (uc *UserController) GetUserByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	user, err := uc.userService.GetUserByID(uint(id))
	if err != nil {
		response.ErrorResponse(c, http.StatusNotFound, "User not found")
		return
	}

	response.SuccessResponse(c, http.StatusOK, user)
}

// GetAllUsers godoc
// @Summary Get all users
// @Description Get list of all users
// @Tags users
// @Accept json
// @Produce json
// @Success 200 {object} response.Response{data=[]models.User}
// @Failure 500 {object} response.Response
// @Router /user/ [get]
func (uc *UserController) GetAllUsers(c *gin.Context) {
	users, err := uc.userService.GetAllUsers()
	if err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to get users")
		return
	}

	response.SuccessResponse(c, http.StatusOK, users)
}

// UpdateUser godoc
// @Summary Update user
// @Description Update user information
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param user body models.User true "User information"
// @Success 200 {object} response.Response{data=models.User}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /user/{id} [put]
func (uc *UserController) UpdateUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	user.ID = uint(id)
	if err := uc.userService.UpdateUser(&user); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to update user")
		return
	}

	response.SuccessResponse(c, http.StatusOK, user)
}

// DeleteUser godoc
// @Summary Delete user
// @Description Delete a user by ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /user/{id} [delete]
func (uc *UserController) DeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.ErrorResponse(c, http.StatusBadRequest, "Invalid user ID")
		return
	}

	if err := uc.userService.DeleteUser(uint(id)); err != nil {
		response.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete user")
		return
	}

	response.SuccessResponse(c, http.StatusOK, "User deleted successfully")
}
