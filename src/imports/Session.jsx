export const Role = {
  GUEST:   0,
  USER:    1,
  ADMIN:   2,
  INVALID: 3
}

export const Session = {
  user:       "",
  isLoggedIn: false,
  isVerified: false,
  role:       Role.GUEST
}
