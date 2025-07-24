// "use client"

// import { useEffect } from "react"

// export function NewsletterForm() {
//   useEffect(() => {
//     // Load Mailchimp scripts only on the client side
//     const script1 = document.createElement("script")
//     script1.src = "https://code.jquery.com/jquery-3.6.0.min.js"
//     script1.async = true
//     document.body.appendChild(script1)

//     const script2 = document.createElement("script")
//     script2.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"
//     script2.async = true
//     document.body.appendChild(script2)

//     const script3 = document.createElement("script")
//     script3.innerHTML = `
//       (function($) {
//         window.fnames = new Array();
//         window.ftypes = new Array();
//         fnames[0]='EMAIL';ftypes[0]='email';
//         fnames[1]='FNAME';ftypes[1]='text';
//         fnames[2]='LNAME';ftypes[2]='text';
//         fnames[3]='ADDRESS';ftypes[3]='address';
//         fnames[4]='PHONE';ftypes[4]='phone';
//         fnames[5]='BIRTHDAY';ftypes[5]='birthday';
//         fnames[6]='COMPANY';ftypes[6]='text';
//         fnames[7]='MMERGE7';ftypes[7]='date';
//         $(document).ready(function() {
//           $('#mc-embedded-subscribe-form').on('submit', function(e) {
//             e.preventDefault();
//             const form = $(this);
//             const url = form.attr('action').replace('/post?', '/post-json?') + '&c=?';
//             const data = form.serialize();
//             $.ajax({
//               url: url,
//               type: 'GET',
//               data: data,
//               dataType: 'jsonp',
//               contentType: 'application/json; charset=utf-8',
//               success: function(resp) {
//                 const successMessage = $('#mce-success-response');
//                 const errorMessage = $('#mce-error-response');
//                 successMessage.hide();
//                 errorMessage.hide();
//                 if (resp.result === 'success') {
//                   successMessage.text('Email subscribed successfully').show();
//                   form[0].reset();
//                 } else {
//                   errorMessage.text(resp.msg || 'Please enter a valid email').show();
//                 }
//               },
//               error: function() {
//                 $('#mce-error-response').text('An error occurred. Please try again.').show();
//               }
//             });
//           });
//         });
//       })(jQuery);
//       var $mcj = jQuery.noConflict(true);
//     `
//     document.body.appendChild(script3)

//     // Cleanup scripts on component unmount
//     return () => {
//       document.body.removeChild(script1)
//       document.body.removeChild(script2)
//       document.body.removeChild(script3)
//     }
//   }, [])

//   return (
//     <div className="max-w-md mx-auto">
//       <form
//         action="https://tapmesaveme.us1.list-manage.com/subscribe/post-json?u=661a5be8a60462f3b7431a783&id=4e4eb6f787&f_id=007887e5f0"
//         method="post"
//         id="mc-embedded-subscribe-form"
//         name="mc-embedded-subscribe-form"
//         className="validate"
//       >
//         <div id="mc_embed_signup_scroll">
//           <div className="mc-field-group flex flex-row gap-2 items-center">
//             <div className="flex-1">
//               <label htmlFor="mce-EMAIL" className="text-sm font-semibold text-dark-gray flex items-center space-x-2">
//                 <span>Email Address <span className="text-emergency-red">*</span></span>
//               </label>
//               <input
//                 type="email"
//                 name="EMAIL"
//                 className="required email mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emergency-red focus:ring-emergency-red focus:ring-opacity-50 text-sm py-2 px-3"
//                 id="mce-EMAIL"
//                 required
//                 placeholder="Enter your email"
//               />
//             </div>
//             <div className="clear">
//               <input
//                 type="submit"
//                 name="subscribe"
//                 id="mc-embedded-subscribe"
//                 className="bg-emergency-red hover:bg-emergency-red/90 text-white font-semibold py-2 px-4 rounded-md text-sm cursor-pointer mt-6"
//                 value="Subscribe"
//               />
//             </div>
//           </div>
//           <div id="mce-responses" className="mt-2">
//             <div className="response text-sm text-red-500" id="mce-error-response" style={{ display: "none" }}></div>
//             <div className="response text-sm text-green-500" id="mce-success-response" style={{ display: "none" }}></div>
//           </div>
//           <div aria-hidden="true" style={{ position: "absolute", left: "-5000px" }}>
//             <input type="text" name="b_661a5be8a60462f3b7431a783_4e4eb6f787" tabIndex={-1} value="" />
//           </div>
//         </div>
//       </form>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    setEmail?: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  }
}

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
        document.body.appendChild(script)
      })
    }

    const loadMailchimp = async () => {
      try {
        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js")
        await loadScript("//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js")

        const script = document.createElement("script")
        script.innerHTML = `
          (function($) {
            window.fnames = new Array();
            window.ftypes = new Array();
            fnames[0]='EMAIL';ftypes[0]='email';
            fnames[1]='FNAME';ftypes[1]='text';
            fnames[2]='LNAME';ftypes[2]='text';
            fnames[3]='ADDRESS';ftypes[3]='address';
            fnames[4]='PHONE';ftypes[4]='phone';
            fnames[5]='BIRTHDAY';ftypes[5]='birthday';
            fnames[6]='COMPANY';ftypes[6]='text';
            fnames[7]='MMERGE7';ftypes[7]='date';
            $(document).ready(function() {
              $('#mc-embedded-subscribe-form').on('submit', function(e) {
                e.preventDefault();
                const form = $(this);
                const url = form.attr('action').replace('/post?', '/post-json?') + '&c=?';
                const data = form.serialize();
                window.setIsLoading(true);
                $.ajax({
                  url: url,
                  type: 'GET',
                  data: data,
                  dataType: 'jsonp',
                  contentType: 'application/json; charset=utf-8',
                  success: function(resp) {
                    const successMessage = $('#mce-success-response');
                    const errorMessage = $('#mce-error-response');
                    successMessage.hide();
                    errorMessage.hide();
                    if (resp.result === 'success') {
                      successMessage.text('Email subscribed successfully').show();
                      form[0].reset();
                      window.setEmail('');
                    } else {
                      errorMessage.text(resp.msg || 'Please enter a valid email').show();
                      window.setEmail('');
                    }
                    window.setIsLoading(false);
                  },
                  error: function() {
                    $('#mce-error-response').text('An error occurred. Please try again.').show();
                    window.setEmail('');
                    window.setIsLoading(false);
                  }
                });
              });
            });
          })(jQuery);
          var $mcj = jQuery.noConflict(true);
        `
        document.body.appendChild(script)

        window.setEmail = setEmail
        window.setIsLoading = setIsLoading

        return () => {
          document.body.removeChild(script)
          delete window.setEmail
          delete window.setIsLoading
        }
      } catch (error) {
        console.error("Mailchimp form script load failed", error)
      }
    }

    const cleanup = loadMailchimp()

    return () => {
      cleanup.then(fn => fn && fn())
    }
  }, [setEmail, setIsLoading])

  return (
    <div className="max-w-md mx-auto">
      <form
        action="https://tapmesaveme.us1.list-manage.com/subscribe/post-json?u=661a5be8a60462f3b7431a783&id=4e4eb6f787&f_id=007887e5f0"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
      >
        <div id="mc_embed_signup_scroll">
          <div className="mc-field-group flex flex-row gap-2 items-center">
            <div className="flex-1">
              <label htmlFor="mce-EMAIL" className="text-sm font-semibold text-dark-gray flex items-center space-x-2">
                <span>Email Address <span className="text-emergency-red">*</span></span>
              </label>
              <input
                type="email"
                name="EMAIL"
                className="required email mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emergency-red focus:ring-emergency-red focus:ring-opacity-50 text-sm py-2 px-3"
                id="mce-EMAIL"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="clear">
              <input
                type="submit"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="bg-emergency-red hover:bg-emergency-red/90 text-white font-semibold py-2 px-4 rounded-md text-sm cursor-pointer mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                value="Subscribe"
                disabled={isLoading}
              />
            </div>
          </div>
          <div id="mce-responses" className="mt-2">
            <div className="response text-sm text-red-500" id="mce-error-response" style={{ display: "none" }}></div>
            <div className="response text-sm text-green-500" id="mce-success-response" style={{ display: "none" }}></div>
          </div>
          <div aria-hidden="true" style={{ position: "absolute", left: "-5000px" }}>
            <input type="text" name="b_661a5be8a60462f3b7431a783_4e4eb6f787" tabIndex={-1} value="" readOnly />
          </div>
        </div>
      </form>
    </div>
  )
}
