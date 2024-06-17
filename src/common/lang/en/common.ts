const common_en = {
  form: {
    label: {
      account: 'Account',
      password: 'Password',
      oldPassword: 'Old password',
      newPassword: 'New password',
      confirmPassword: 'Confirm password',
      firstName: 'First name',
      lastName: 'Last name',
      fullName: 'Full name',
      phone: 'Phone',
      email: 'Email',
      gender: 'Gender',
      birthday: 'Birthday',
      fullAddress: 'Address',
      address_en: 'Address (EN)',
      address_vn: 'Address (VN)',
      city: 'City/Province',
      district: 'District',
      ward: 'Ward',
      note: 'Note',
      status: 'Status',
      optional: 'Optional'
    },
    placeholder: {
      enter: 'Enter infomation',
      select: 'Select',
      search: 'Search',
      imagesUpload: 'Select or drag image here',
      filesUpload: 'Choose file'
    },
    rule: {
      required: 'This field is required',
      phone: 'Phone invalid',
      email: 'Email invalid',
      confirmPassword: 'The passwords do not match',
      whiteSpace: 'White space are not allowed',
      min: '{{min}} is minimum',
      max: '{{max}} is maximum',
      minLength: 'Must have at least {{min}} character',
      maxLength: 'Maximum length {{max}} characters'
    },
    others: {
      emptyOptions: 'No options',
      optional: 'Optional',
      fileSize: 'File size must not greater than {{num}}MB',
      fileType: 'Only accept file type {{type}}',
      fileMax: 'Can only upload {{num}} image per time',
      newUploadImg: 'New images',
      uploadedImg: 'Uploaded images'
    }
  },
  actions: {
    ok: 'Ok',
    send: 'Send',
    save: 'Save',
    edit: 'Edit',
    update: 'Update',
    remove: 'Remove',
    filter: 'Filter',
    cancel: 'Cancel'
  },
  table: {
    head: {
      customerName: 'Full name',
      phone: 'Phone',
      email: 'Email',
      gender: 'Gender',
      birthday: 'Birthday',
      address: 'Address',
      image: 'Image',
      status: 'Status',
      createdAt: 'Created date',
      updatedAt: 'Updated date'
    }
  },
  pagination: {
    showing: 'Showing',
    of: 'of',
    result: 'results'
  },
  message: {
    success: {
      signIn: 'Sign in success',
      signUp: 'Sign up success',
      logout: 'Logouted',
      changePassword: 'Password has been changed',
      resetPassword: 'Password has been reset'
    },
    error: {
      authEmail: 'Email is not correct. Please try again',
      authPassword: 'Password is not correct. Please try again',
      emailExist: 'Email is already exist',
      logout: 'Logout failed',
      remove: 'Remove failed',
      api: 'Api network failed'
    }
  }
}

export default common_en
