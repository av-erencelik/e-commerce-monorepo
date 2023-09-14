enum Subjects {
  // user events
  userCreated = 'user:created',
  userVerified = 'user:verified',
  userUpdated = 'user:updated',
  userResend = 'user:resend',
  userResetPassword = 'user:resetpassword',
  userPasswordChange = 'user:passwordchange',
  // product events
  productCreated = 'product:created',
  productUpdated = 'product:updated',
  productDeleted = 'product:deleted',
  productPriceUpdated = 'product:priceupdated',
  productPriceDeleted = 'product:pricedeleted',
  productStockUpdated = 'product:stockupdated',
}

export { Subjects };
