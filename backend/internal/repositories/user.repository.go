package repositories

type IUserRepository interface {
	GetUserByEmail(email string) bool
}

type userRepository struct{}

func NewUserRepository() IUserRepository {
	return &userRepository{}
}

func (*userRepository) GetUserByEmail(email string) bool {
	return true
}
