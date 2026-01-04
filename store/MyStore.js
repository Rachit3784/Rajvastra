import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import RazorpayCheckout from 'react-native-razorpay'; 
export const BASE_URL = "http://10.147.167.121:4333";
const Razor_Pay_API_KEY=""
const SECURE_STORE_KEY = 'userToken';

const saveToken = async (token) => {
  if (token) {
    await Keychain.setGenericPassword(SECURE_STORE_KEY, token, {
      service: SECURE_STORE_KEY,
    });
  }
};


const deleteToken = async () => {
        await Keychain.resetGenericPassword({ service: SECURE_STORE_KEY });
};


const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};



const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: SECURE_STORE_KEY });
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error("Keychain retrieval failed:", error);
    return null;
  }
};

const userStore = create(
  persist(
   (set, get) => ({
    userName: null,
    token: null,
    userEmailID: null,
    userModelID: null,
    userData: null,
    gender: null,
    userProfileData: null,
    adminId : null,
    loadTrendingProduct : async (page=1,limit=10)=>{
       try {
        const request = await fetch(`${BASE_URL}/fetch-product/fetch-trending-product?page=${page}&limit=${limit}` , {
          method : 'GET',
          headers : {
            'Content-Type' : 'application/json'
          }
        })
        const response = await request.json();

        if(!request.ok){
          console.log(request.statusText || response.msg);
          return {msg : "Failed To fetch trending product" , success : false}
        }
        if(response && response.success){
          return {msg  :"Trending Product Successfully " , success : true , TrendingProductList : response.TrendingProductList}
        }
      }catch(error){
        console.log(error)
        return {msg : "Trending Product Fetching Failed" , success : false}
      }
     },

    
    forgetPasswordRequest: async (email) => {
      try {
        console.log("Forget Password Request Called");
        const resp = await fetch(`${BASE_URL}/authenticate/forgetPass`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const respData = await resp.json();
        if (!resp.ok) {
          return { message: respData?.msg || 'Failed to send OTP for password recovery', success: false };
        }


        if (respData.success) {
          return { message: respData.msg, success: true };
        } else {
          return { message: respData.msg, success: false };
        }

      } catch (error) {
        console.error('ForgetPasswordRequest Error:', error);
        return { message: 'An error occurred during forget password request', success: false };
      }
    },



    updateUserProfile: async (data) => {
      try {
        console.log(data);
        if (!data) return { message: "Data is empty", success: false };
        const response = await fetch(`${BASE_URL}/authenticate/updateProfile`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserKeyWord: data.UserKeyWords,
            UserDescription: data.UserDescription,
            userId: data.userId
          })
        });

        const output = await response.json();

        if (!response.ok) {
          return {
            message: output.msg || response.statusText || "Unknown Error uploading details",
            success: false
          };
        }

        set((prev) => ({
          ...prev,
          userEmailID: output.result.email,
          userData: output.result,
          userProfileData: {
            UserKeyWord: output.result.UserKeyWord,
            UserDescription: output.result.UserDescription
          },
          adminId : output.result.admin
        }));

        console.log(output.result.UserKeyWord, output.result.UserDescription);

        return {
          message: output?.msg || "details uploaded",
          success: true
        };

      } catch (error) {
        console.log(error);
        return { message: "Failed uploading details", success: false };
      }
    },

    createUser: async (data) => {
      try {
        const response = await fetch(`${BASE_URL}/authenticate/register`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          console.log(responseData?.msg);
          return { message: responseData?.msg || response.statusText || 'Unknown error', success: false };
        }

        if (responseData.success) {
          return { message: responseData.msg, success: true };
        }
      } catch (error) {
        console.error('Signup Error:', error);
        return 'An error occurred during signup';
      }
    },

    verifyNewUser: async (data) => {
      try {
        console.log(data);
        const resp = await fetch(`${BASE_URL}/authenticate/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, otp: data.code , password : data.password }),
        });

        const respData = await resp.json();

        if (!resp.ok) {
          console.log(respData.msg);
          return { message: respData?.msg || 'Error verifying user', success: false };
        }

        if (respData?.token) {
            await saveToken(respData.token); 
          }

        console.log(respData)

        set((currentState) => ({
          ...currentState,
          userName: respData?.detail.username,
          token: respData?.token,
          userEmailID: respData?.detail.email,
          userModelID: respData?.detail._id,
          userData: respData?.detail,
          gender: respData?.detail.gender,
        
        }));

        console.log(respData?.detail);

        return { message: "Account Created", success: true };
      } catch (error) {
        console.error('Verify OTP Error:', error);
        return { message: 'An error occurred during OTP verification', success: false };
      }
    },

    login: async (data) => {
      try {
        const emaill = data.email;
        const pass = data.password;

        const resp = await fetch(`${BASE_URL}/authenticate/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emaill, password: pass }),
        });

        const respData = await resp.json();

        if (!resp.ok) {
          return { message: respData?.msg || 'Login failed', success: false };
        }

       if(respData && respData.success){

        
         if (respData?.token) {
          console.log(respData?.token)
          await saveToken(respData.token);  
        }

    

        set((currentState) => ({
          ...currentState,
          userName: respData?.detail.username,
          token: respData?.token,
          userEmailID: respData?.detail.email,
          userModelID: respData?.detail._id,
          userData: respData?.detail,
          gender: respData?.detail.gender,
          userProfileData: {
            UserDescription: respData?.detail.UserDescription,
            UserKeyWord: respData?.detail.UserKeyWord
          },
          
          
          
        }));

       }


        return { message: "Logged In Successfully", success: true };
      } catch (error) {
        console.error('Login Error:', error);
        return { message: 'An error occurred during login', success: false };
      }
    },

    loginWithCookie: async (token) => {
      try {
    
        const resp = await fetch(`${BASE_URL}/authenticate/verifywithCookie`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const respData = await resp.json();

        if (!resp.ok) {
          console.log("Session invalid");
          return { message: respData?.msg || 'Session invalid', success: false };
        }
        const user = respData?.userdata;



        set((currentState) => ({
          ...currentState,
          userName: user?.username,
          userEmailID: user?.email,
          userModelID: user?._id,
          userData: user,
          gender: user?.gender,
          adminId : user?.admin
        }));

        
        
        

        return { message: respData.msg, success: true };

      } catch (error) {

        console.error('LoginWithCookie Error:', error);
        return { message: "Error occurred", success: false };
      }
    },

    ResetPassword: async (data) => {
      try {
        const resp = await fetch(`${BASE_URL}/authenticate/resetPass`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!resp.ok) {
          const errorData = await resp.json();
          return { message: errorData.msg || "Error resetting password", success: false };
        }

        const respData = await resp.json();

        if (respData?.token) {
         await saveToken(respData.token); 
        }

        set((currentState) => ({
          ...currentState,
          userName: respData?.detail.username,
          token: respData?.token,
          userEmailID: respData?.detail.email,
          userModelID: respData?.detail._id,
          userData: respData?.detail,
          userProfileData: {
            UserDescription: respData?.detail.UserDescription,
            UserKeyWord: respData?.detail.UserKeyWord
          },
          gender: respData?.detail.gender,
          adminId : respData?.detail.admin
         

        }));


        


        console.log(get());

        return { message: "Password Reset Successful", success: true };

      } catch (error) {
        console.log(error);
        return { message: "Unexpected error occurred. Please try again.", success: false };
      }
    },

    verifyForgottedUser: async (data) => {
      try {
        const resp = await fetch(`${BASE_URL}/authenticate/verifyForgotUser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, otp: data.code }),
        });

        const respData = await resp.json();

        if (!resp.ok) {
          console.log(respData.msg);
          return { message: respData?.msg || 'Error verifying user', success: false };
        }

        if (!respData.success) return { message: respData.msg, success: respData.success };

        return { message: "OTP Verified", success: true };

      } catch (error) {
        console.error('Verify OTP Error:', error);
        return { message: 'An error occurred during OTP verification', success: false };
      }
    },

    accountRecover: async (data) => {
      try {
        if (!data.identifier) {
          return 'Please provide an email or username';
        }

        const resp = await fetch(`${BASE_URL}/authenticate/account-recover`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: data.identifier }),
        });

        const respData = await resp.json();

        if (!resp.ok) {
          return respData?.msg || 'Account recovery failed';
        }

        return respData;
      } catch (error) {
        console.error('AccountRecover Error:', error);
        return 'An error occurred during account recovery';
      }
    },

    logout: async () => {
      await deleteToken()
      set({
        userName: null,
        token: null,
        userEmailID: null,
        userModelID: null,
        userData: null,
        gender: null,
        userProfileData: null,
        adminId : null
      });
      await AsyncStorage.removeItem('zustand'); 
    },

    loadUserFromStorage: async () => {
      try {
        const token = await getToken()
        if (!token) return false;
        set({ token });
        return true;
      } catch (error) {
        console.error('LoadUserFromStorage Error:', error);
        return false;
      }
    },

    
    loadNearStore : async (data)=>{
      try{
     console.log("jkjk")
        const {
          latitude, longitude , page
        } = data

console.log(data)
        const request = await fetch(`${BASE_URL}/fetch-store/near-stores?latitude=${latitude}&longitude=${longitude}&page=${page}` , {
          method : 'GET',
         headers : {
            'Content-Type' : 'application/json'
          }
        })


        const response = await request.json();

        if(!request.ok) {
          console.log(response.msg  || request.statusText)
          return {msg : "Failed To Load" , success : false};

        }


        if(response && response.success){
         return {msg : "Fetched Successfully " , success : true , StoreList : response.nearbyTop50}
        }
        
 return {msg : "Failed To Load" , success : false};

      }catch(error){
        return {msg : "Failed to fetch" , success : false}
      }
    },


    fetchSearchedProduct : async (text,page=1,limit=10)=>{
       try{

        const request = await fetch(`${BASE_URL}/fetch-product/fetch-searched-product?q=${text}&page=${page}&limit=${limit}` ,{
          method : 'GET'
        });

        const response = await request.json();

        if(!request.ok) return {msg : 'Failed' , success : false};
 
        if(response.success)  return {msg : 'Success' , success : true , products :  response.data};

       }catch(error){
        console.log(error)
        return {msg : 'Failed' , success : false};
       }
    },

 fetchOrders: async (page = 1, limit = 10) => {
  try {
    const { userModelID } = get();
    const token = await getToken();

    if (!userModelID) {
      return { msg: "User not logged in", success: false };
    }

    const request = await fetch(
      `${BASE_URL}/order/fetch-orders?customerId=${userModelID}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const response = await request.json();

    if (!request.ok) {
      return {
        msg: response.msg || "Failed to fetch orders",
        success: false,
      };
    }


  
    return {
      msg: "Success",
      success: true,
      orders: response?.orders,
      currentPage: response.currentPage,
      count: response.count,
    };

  } catch (error) {
    console.error("fetchOrders Error:", error);
    return { msg: "Something went wrong", success: false };
  }
},

AddtoCart : async (parentId,VarientId,Size)=>{
 try{
        const {userModelID} = get();
        const token = await getToken();
        console.log("called")
        
        const request = await fetch(`${BASE_URL}/order/add-to-cart`,{
          method : "POST",
          headers : {
            'Content-Type' : 'application/json',
            'Authorization'  : `Bearer ${token}`
          },
          body : JSON.stringify({productId : parentId, varientId : VarientId, size : Size,customerId : userModelID})
        });


        const response = await request.json();
console.log(response)
        if(!request.ok){
          return {msg : "Failed" , success: false};
        }

        if(response.success){
          return {msg : "Successfully Ordered" , success : true};

        }
      

     }catch(error){
      return {msg  : "Failed" , success : false}
     }
},

deleteCart  : async (CartId)=>{
 try{
       
        const token = await getToken();
        console.log("called")
        
        const request = await fetch(`${BASE_URL}/order/delete-from-cart?cartId=${CartId}`,{
          method : "GET",
          headers : {
            'Content-Type' : 'application/json',
            'Authorization'  : `Bearer ${token}`
          },
         
        });


        const response = await request.json();


console.log(response)
        if(!request.ok){
          return {msg : "Failed" , success: false};
        }

        if(response.success){
          return {msg : "Successfully Ordered" , success : true};

        }
      

     }catch(error){
      return {msg  : "Failed" , success : false}
     }
},

 fetchCarts: async (page = 1, limit = 10) => {
  try {
    const { userModelID } = get();
    const token = await getToken();

    if (!userModelID) {
      return { msg: "User not logged in", success: false };
    }

    const request = await fetch(
      `${BASE_URL}/order/fetch-my-cart?customerId=${userModelID}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const response = await request.json();


    
    if (!request.ok) {
      return {
        msg: response.msg || "Failed to fetch orders",
        success: false,
      };
    }


  
    return {
      msg: "Success",
      success: true,
      carts: response?.cartList,
      currentPage: response.currentPage,
      count: response.count,
    };

  } catch (error) {
    console.error("fetchOrders Error:", error);
    return { msg: "Something went wrong", success: false };
  }
},


AddtoWishlists : async (parentId,VarientId,Size)=>{
 try{
        const {userModelID} = get();
        const token = await getToken();
        console.log("called")
        
        const request = await fetch(`${BASE_URL}/order/add-to-wishlist`,{
          method : "POST",
          headers : {
            'Content-Type' : 'application/json',
            'Authorization'  : `Bearer ${token}`
          },
          body : JSON.stringify({productId : parentId, varientId : VarientId, size : Size,customerId : userModelID})
        });


        const response = await request.json();
console.log(response)
        if(!request.ok){
          return {msg : "Failed" , success: false};
        }

        if(response.success){
          return {msg : "Successfully Ordered" , success : true , wishListId : response.wishListId};

        }
      

     }catch(error){
      return {msg  : "Failed" , success : false}
     }
},

CheckwishList : async (parentId,VarientId,Size)=>{
 try{
        const {userModelID} = get();
        const token = await getToken();
        console.log("calledooooooooooooooooooooooooooooo")
        
        const request = await fetch(`${BASE_URL}/order/check-to-wishlist`,{
          method : "POST",
          headers : {
            'Content-Type' : 'application/json',
            'Authorization'  : `Bearer ${token}`
          },
          body : JSON.stringify({productId : parentId, varientId : VarientId, size : Size,customerId : userModelID})
        });



       
        const response = await request.json();
console.log(response)
        if(!request.ok){
          return {msg : "Failed" , success: false , wishListId : ''};
        }

        if(response.success){
          return {msg : "Successfully Ordered" , success : true , wishListId  : response.wishListId};

        }
      

     }catch(error){
      return {msg  : "Failed" , success : false , wishListId : ''}
     }
},


deleteWishlists  : async (WishlistId)=>{
 try{
       
        const token = await getToken();
        console.log("called")
        
        const request = await fetch(`${BASE_URL}/order/delete-from-wishlist?WishlistId=${WishlistId}`,{
          method : "GET",
          headers : {
            'Content-Type' : 'application/json',
            'Authorization'  : `Bearer ${token}`
          },
         
        });


        const response = await request.json();


console.log(response)
        if(!request.ok){
          return {msg : "Failed" , success: false};
        }

        if(response.success){
          return {msg : "Successfully Ordered" , success : true};

        }
      

     }catch(error){
      return {msg  : "Failed" , success : false}
     }
},

 fetchWishLists: async (page = 1, limit = 10) => {
  try {

    console.log('kkkkkcakaaled')
    const { userModelID } = get();
    const token = await getToken();

    if (!userModelID) {
      return { msg: "User not logged in", success: false };
    }

    const request = await fetch(
      `${BASE_URL}/order/fetch-my-wishlist?customerId=${userModelID}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const response = await request.json();


    
    if (!request.ok) {
      return {
        msg: response.msg || "Failed to fetch orders",
        success: false,
      };
    }


  console.log(response?.Wishlist)
    return {
      msg: "Success",
      success: true,
      carts: response?.Wishlist,
      currentPage: response.currentPage,
      count: response.count,
    };

  } catch (error) {
    console.error("fetchOrders Error:", error);
    return { msg: "Something went wrong", success: false };
  }
},



  OrderProduct: async (data) => {
  try {
    const { userModelID } = get();
    const token = await getToken();

    const request = await fetch(`${BASE_URL}/order/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data, customerId: userModelID }),
    });

    const response = await request.json();
    console.log("Order response:", response);

    if (!request.ok || !response.success) {
      return { msg: response?.msg || "Order Failed", success: false };
    }

    return { msg: "Order Placed Successfully", success: true };

  } catch (error) {
    console.log("OrderProduct error:", error);
    return { msg: "Order Failed", success: false };
  }
},


  PlaceOnlinePaymentOrder: async (data) => {
  try {
    const token = await getToken();

    const request = await fetch(`${BASE_URL}/payment/create-order-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: data.discountedPrice, // backend converts to paise
      }),
    });

    const response = await request.json();
    console.log("Create orderId response:", response);

    if (!request.ok || !response.success) {
      return { msg: response?.msg || "Failed to create payment order", success: false };
    }

    return {
      msg: "Payment Order Created",
      success: true,
      verificationData: response.order,
    };

  } catch (error) {
    console.log("PlaceOnlinePaymentOrder error:", error);
    return { msg: "Payment Order Failed", success: false };
  }
},

   VerifyOnlinePayment: async (data) => {
  try {
    const { userModelID, userEmailID } = get();
    
    const options = {
      key: Razor_Pay_API_KEY,
      amount: data.amount,
      currency: data.currency,
      name: "RajVashtra",
      description: "Online Payment",
      order_id: data.id,
      prefill: {
        email: userEmailID,
      },
      theme: { color: "#000" }, 
    };

    // 🔥 Open Razorpay

    console.log("kkkkehbhhfbjhbjfbh")
    const razorpayResponse = await RazorpayCheckout.open(options);
    console.log("Razorpay success:", razorpayResponse);

    const token = await getToken();

    const request = await fetch(`${BASE_URL}/payment/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        email: userEmailID,
        customerId: userModelID,
      }),
    });

    const result = await request.json();
    console.log("Verify payment response:", result);

    if (!request.ok || !result.success) {
      return { msg: result?.msg || "Payment Verification Failed", success: false };
    }

    return { msg: "Payment Verified Successfully", success: true , paymentDoc: result.paymentDoc, };

  } catch (error) {
    console.log("VerifyOnlinePayment error:", error);
    return { msg: "Payment Cancelled or Failed", success: false };
  }
},


    loadAllStore : async (page)=>{
      try{
        const request = await fetch(`${BASE_URL}/fetch-store/all-stores?page=${page}`,{
          method : 'GET',
          headers : {
            'Content-Type' : 'application/json'
          }
        });

        const response = await request.json();
    //  console.log(response)
        if(!request.ok){
          console.log(request.statusText || response.msg);
          return {msg : "Failed To Fetch"  , success : false}
        }

        if(response && response.success){
          // console.log(response)
          return {msg : "Fetched Successfully" , success : true , StoreList : response.allStore}
        }

      }catch(error){
        console.log(error)
        return {msg : "Failed To Fetch" ,  success : false};
      }
    },



addAddress: async (
  addressLine1,
  addressLine2,
  city,
  district,
  state,
  country,
  pincode,
  latitude,
  longitude,
  addressType,
  mobileNum,
  landmark
) => {
  try {
    const { userModelID, userName = "User" } = get();
    const token = await getToken();

    if (!token || !userModelID) {
      return { success: false, msg: "User not authenticated" };
    }

    const payload = {
      ownerId: userModelID,
      ownerType: "Users",
      name: userName,

      addressType,
      landmark: landmark || "",
      addressLine1,
      addressLine2: addressLine2 || "",

      city,
      district,
      state,
      country,
      pincode,

      mobileNo: mobileNum ? [mobileNum] : [],

      location: {
        type: "Point",
        coordinates: [longitude, latitude], // 🔥 lng first, lat second
      },
    };

    console.log("📦 ADD ADDRESS PAYLOAD:", JSON.stringify(payload, null, 2));

    const request = await fetch(`${BASE_URL}/address/add-address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const response = await request.json();

    if (!request.ok || !response.success) {
      console.log("❌ Address API error:", response);
      return {
        success: false,
        msg: response?.msg || "Failed to add address",
      };
    }

    console.log("✅ Address saved successfully:", response.data);

    return {
      success: true,
      msg: "Address saved successfully",
      data: response.data,
    };
  } catch (error) {
    console.log("❌ Zustand addAddress error:", error);
    return {
      success: false,
      msg: "Something went wrong while adding address",
    };
  }
},



   

    loadPerticularProduct: async (variantId, parentId) => {
  try {
    const request = await fetch(
      `${BASE_URL}/fetch-product/fetch-selected-product?parentId=${parentId}&variantId=${variantId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const response = await request.json();

    if (!request.ok || !response.success) {
      console.log(response?.msg || request.statusText);
      return { success: false, msg: "Failed to fetch selected product" };
    }

    return {
      success: true,
      ParentProduct: response.ParentProduct,
      SelectedVariant: response.SelectedVariant,
    };

  } catch (error) {
    console.log(error);
    return { success: false, msg: "Failed to fetch selected product" };
  }
},
deleteAddress: async (addressId) => {
  try {
    if (!addressId) {
      return { success: false, msg: 'AddressId missing' };
    }

    const token = await getToken();
    if (!token) {
      return { success: false, msg: 'Unauthorized' };
    }

    const request = await fetch(`${BASE_URL}/address/delete-address`, {
      method: 'POST', // backend agar POST expect karta hai
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ AddressId : addressId}),
    });

    const response = await request.json();

    if (!request.ok || !response?.success) {
      return {
        success: false,
        msg: response?.msg || 'Delete failed',
      };
    }

    return {
      success: true,
      msg: 'Address deleted successfully',
    };
  } catch (error) {
    console.log('deleteAddress error:', error);
    return {
      success: false,
      msg: 'Something went wrong',
    };
  }
},

// In your MyStore.js
fetchAddress: async (page = 1, limit = 5) => {
  try {
    const { userModelID } = get();
    const token = await getToken(); // Make sure this is async
    
    const request = await fetch(`${BASE_URL}/address/fetch-my-address?OwnerId=${userModelID}&page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Fixed: was 'ContentType'
        'Authorization': `Bearer ${token}`
      }
    });
    
    const response = await request.json();

    if (!request.ok) {
      return { msg: 'Failed', success: false };
    }

    if (response.success) {
      return { 
        msg: 'Success', 
        success: true, 
        AddressList: response.AddressList, 
        total: response.total 
      };
    }

    return { msg: 'Failed', success: false };
  } catch (error) {
    console.log('Zustand fetchAddress error:', error);
    return { msg: 'Failed', success: false };
  }
},

fetchUserInfo : async ()=>{
  try{

    const {userModelID} = get();
    const token = getToken();

    const req = await fetch(`${BASE_URL}/authenticate/fetch-user-info?userId=${userModelID}`,{
      method : 'GET',
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    })


    const res = await req.json();

    if(!req.ok) {
          return {msg : 'Failed' , succes : false};
    }

    if(res.succes){
          return {msg : 'Fetched' , succes : true , user : res.user};
    }


  }catch(error){
    console.log(error)
    return {msg : 'Failed' , succes : false};

  }
},





   SearchUser : async (text , limit , page)=>{
    try{
        const request = await fetch(`${BASE_URL}/authenticate/find-user?q=${text}&page=${page}&limit=${limit}` , {
          method : 'GET'
        })
        const response = await request.json();

        if(!request.ok){
             console.log(response.msg || request.statusText || "Unknown Error");
             
             return []; // Or throw new Error(response.msg || request.statusText);
        }

        if(response.success){
          
          return response.data;
        }

        
        return []; // Return an empty array if the API indicated failure
        
    }catch(error){
        console.log(error)
        // Return an empty array on network/parsing error
        return [];
    }
},

//   handleConnectionRequest : async (AccountType,FriendId,requestType)=>{
//     try{
//       const {userModelID } = get();
//       const token = await getToken()
//       console.log(token)
// console.log("Connection Sended")
//       const request = await fetch(`${BASE_URL}/user-action/frient-request?UserId=${userModelID}&accountType=${AccountType}&friendId=${FriendId}&reqType=${requestType}`,{
//         method : 'POST',
//         headers :{
//           'Authorization' : `Bearer ${token}`
//         }

        

//       })

//       const response = await request.json()

//       if(!request.ok){
//         console.log(request.statusText || response.msg || "Unknown Error");
//         return {msg : "Failed" , success : false}
//       }

//       return {msg : "Successfull" , success : true}


//     }catch(error){
//      console.log(error)
//      return {msg : "Failed" , success : false}
//     }
//   },


// handleConnectionRequest: async (accountType, friendId, requestType) => {
//   try {
//     const { userModelID } = get();
//     const token = await getToken();

//     console.log("Token:", token);
//     console.log("Connection Request Sending...");

//     // Build URL safely using URLSearchParams
//     const queryParams = new URLSearchParams({
//       UserId: userModelID,
//       accountType,
//       friendId,
//       reqType: requestType
//     });

//     const request = await fetch(
//       `${BASE_URL}/user-action/frient-request?${queryParams.toString()}`,
//       {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({}) // if your API expects empty body or can remove if not needed
//       }
//     );

//     const response = await request.json().catch(() => ({})); // safe parse

//     if (!request.ok) {
//       console.log(response.msg || request.statusText || "Unknown Error");
//       return { msg: "Failed", success: false };
//     }

//     console.log("Connection Request Successful");
//     return { msg: "Successful", success: true };

//   } catch (error) {
//     console.log("Connection Request Error:", error);
//     return { msg: "Failed", success: false };
//   }
// },

// checkUserProfile: async (friendId, accountType) => {
//   const {  userModelID } = get();
//  const token = await getToken()

//   try {

//     const url = `${BASE_URL}/user-action/check-profile?UserId=${userModelID}&friendId=${friendId}&accountType=${accountType}`;

//     const request = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     });

//     const response = await request.json();

//     if (!request.ok) {
//       console.log(response.msg || "Unknown Error");
//       return { msg: response.msg || "Failed", success: false };
//     }

//     // Return the exact backend response
//     return {
//       msg: response.msg,
//       success: response.success,
//       status: response.status ?? null   // optional, depending on backend
//     };

//   } catch (error) {
//     console.log(error);
//     return { msg: "Failed", success: false };
//   }
// }


handleConnectionRequest: async (accountType, friendId, requestType) => {
    try {
      const { userModelID } = get();
      const token = await getToken();

      const params = new URLSearchParams({
        UserId: userModelID,
        accountType: accountType === 'public' ? 'Public' : 'Private',
        friendId,
        reqType: requestType,
      });

      const res = await fetch(
        `${BASE_URL}/user-action/frient-request?${params.toString()}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );

      const payload = await safeJson(res);

      if (!res.ok) {
        console.log(payload.msg || res.statusText || 'Unknown Error');
        return { msg: payload.msg || 'Failed', success: false };
      }

      return {
        msg: payload.msg || 'Success',
        success: !!payload.success,
        status: payload.status ?? null,
      };
    } catch (error) {
      console.log('Connection Request Error:', error);
      return { msg: 'Failed', success: false };
    }
  },

  checkUserProfile: async (friendId, accountType) => {
    try {
      const { userModelID } = get();
      const token = await getToken();

      const url = `${BASE_URL}/user-action/check-profile?UserId=${userModelID}&friendId=${friendId}&accountType=${accountType}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const payload = await safeJson(res);

      if (!res.ok) {
        console.log(payload.msg || 'Unknown Error');
        return { msg: payload.msg || 'Failed', success: false };
      }

      return {
        msg: payload.msg,
        success: payload.success,
        status: payload.status ?? null,
      };
    } catch (error) {
      console.log('checkUserProfile error:', error);
      return { msg: 'Failed', success: false };
    }
  },
  }

),
    {
      name: 'rajvashtra-user-store', // Key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Persist everything except the token (it's in Keychain)
        userName: state.userName,
        userEmailID: state.userEmailID,
        userModelID: state.userModelID,
        userData: state.userData,
        gender: state.gender,
        userProfileData: state.userProfileData,
        adminId: state.adminId,
      }),
    }
  )
);

export default userStore;