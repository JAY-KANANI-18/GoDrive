// CLIENT SIDE

//********************** START DECLARATION OF VARIABLES *********************

const PAGE_SIZE = 5; // Set the number of items to show per page
let page = 1; //starting page as 1 
const lastPage = +$(`#lastpage`).text()//give the last page 
let toggle2 = true //by default toggle button valu
let update = false


//************************** END DECLARATION OF VARIABLES ***************





//********************** START DECLARATION OF FUNCTIONS *********************



//****CLEARINPUT of INSERT FORM  FUNCTION ****
const clearInputs = function () {

    //EMPTY ALL FORM INPUT VALUE
    $(`#nameid`).val(``)
    $(`#emailid`).val(``)
    $(`#numberid`).val(``)
    $(`#countryid`).val(``)
    $(`#fileid`).val(``)
    $(`#search`).val(``)
}




//**** SHOW DATA IN TABLE *****
function Show() {
    let searchVal = $("#search").val()


    $.ajax({
        type: 'GET',
        url: `/show?page=${page}&size=${PAGE_SIZE}&str=${searchVal}`,
        dataType: "json",
        success: function (response) {


            // $(`table`).css(`visibility`, `visible`)
            if (!response.totalUser) {

                $('footer').empty();
                $('tbody').empty();
                $('tbody').append('<tr class="flexxx"><td class="td" colspan="6" >no user found</td></tr>')

            } else {


                $('footer').empty();
                $('tbody').empty();
                response.data.forEach(function (user, indexes) {
                    if (!user.avatar) {
                        user.avatar = `default.jpeg`
                    }



                    $('tbody').append('\
                        <tr id='+ user._id + '>\
                        <form><td class="nametd"><input type="text"  value="' + user.name + '" disabled >\
                        <td  class="emailtd" ><input type="text"  value="' + user.email + '" disabled ></td>\
                        <td class="numbertd" ><input type="text"   oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" maxlength="10"  value="' + user.mobile + '" disabled></td>\
                        <td class="countrytd"><input type="text"  value="' + user.country + '" disabled></td>\
                        <td class="imgtd"><img class="imgClass" src ="/avatars/'+ user.avatar + '"></td>\
                        <td id= "b'+ user._id + '">\
                        <button id= u'+ user._id + ' class= "update-button btn btn-outline-primary"  >UPDATE</button>\
                        <button id= d'+ user._id + ' class= "delete-button btn btn-outline-danger" >DELETE</button>\
                        </td>\
                        </form></tr>\
                        ');

                    if (response.data.length == "1") {
                        $(`#d${user._id}`).attr(`id`, `last${user._id}`)
                    }
                });
                const totalUsers = response.totalUser
                const limit = response.limits


                const No_of_pages = Math.ceil(totalUsers / limit)

                $(`footer`).append(`<button class="btn vh" id="previouspage" >Previous</button>`)
                // console.log("page active", page);
                // console.log("total", No_of_pages);

                for (i = page-1 ; i < page+2; i++) {
                  
                    if (i  == 1) {
                        $(`footer`).append(` <button id= "firstpage" class="btn">${i } </button> `)


                    } else if (i  == No_of_pages) {

                        $(`footer`).append(` <button id= "lastpage" class="btn">${i } </button> `)
                    } else if ((i <= No_of_pages)&& (i!== 0)){
                        
                        $(`footer`).append(` <button id= "p${i }" class="btn">${i } </button> `)
                    }

                }

                $(`footer`).append(`<button class="btn" id="nextpage">Next</button>`)

                if (page == 1) {
                    $(`#firstpage`).addClass(`active`)


                } if (page == No_of_pages) {
                    $(`#lastpage`).addClass(`active`)


                } else {
                    $(`#p${page}`).addClass(`active`)


                }

                if (page > 1) {
                    $("#previouspage").removeClass("vh")
                }

                if (page == No_of_pages) {
                    $("#nextpage").css("visibility", "hidden")
                }


            }





        },
        error: function (e) {
            console.log("get ma error")
        }
    })
}

//***** TOGGLE BUTTON (SEARCH USER TO ADD USER) *********
const searchToggle = function () {
    if (toggle2 === true) {
        $(`#form2`).css(`display`, `block`)
        $(`#form1`).css(`display`, `none`)
        $(`#search-btn`).text(`Add User`)
        $(`#formhead`).text(`Search User`)
        clearInputs()
        Show()

        toggle2 = false


    } else {
        $('tbody').empty();
        $(`#form1`).css(`display`, `block`)
        $(`#form2`).css(`display`, `none`)
        $(`#formhead`).text(`Insert New User`)
        $(`#search-btn`).text(`search User`)
        clearInputs()
        Show()

        // $(`input`).val() = ""

        toggle2 = true


    }

}


//******************** END DECLARATION OF FUNCTION ***********************


$(document).ready(function () {

    Show()

    // TOGGLE BUTTON
    $(`#search-btn`).click(function (event) {
        searchToggle()
    })

    //**** INSERT USER *****
    $("#form1").submit(function (event) {

        event.preventDefault();
        $(`.error-message`).empty()


        //STORE ALL FORM VALUES
        const nameVal = $("#nameid").val()
        const emailVal = $("#emailid").val()
        const numberVal = $("#numberid").val()
        const countryVal = $('#countryid').val()
        const fileVal = document.getElementById("fileid").files[0]

        //CREATE FORMDAT AND ADD FORM VALUED
        const formdata = new FormData()
        formdata.append("name", nameVal)
        formdata.append("email", emailVal)
        formdata.append("mobile", numberVal)
        formdata.append("country", countryVal)
        formdata.append("avatar", fileVal)


        var nameRegex = /^[a-zA-Z\s]*$/;
        var countryRegex = /^[a-zA-Z\s]*$/;
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var contactRegex = /^[0-9]{10}$/;



        if (nameVal == '') {
            $('#nameid').after('<div class="error-message" id="name-error">*Please enter your name.</div>');
            event.preventDefault()
        } else if (!nameRegex.test(nameVal)) {
            $('#nameid').after('<div class="error-message" id="name-error">*Please enter your valid name.</div>');
            event.preventDefault()

        }

        if (emailVal == '') {
            $('#emailid').after('<div class="error-message" id="email-error">*Please enter your email.</div>');
            event.preventDefault()

        } else if (!emailRegex.test(emailVal)) {
            $('#emailid').after('<div class="error-message" id="email-error">*Please enter valid email.</div>');
            event.preventDefault()

        }

        if (numberVal == '') {
            $('#numberid').after('<div class="error-message" id="number-error">*Please enter a 10 digit contact number.</div>');
            event.preventDefault()

        } else if (!contactRegex.test(numberVal)) {
            $('#numberid').after('<div class="error-message" id="number-error">*Please enter a valid 10 digit contact number.</div>');
            event.preventDefault()

        }

        if (countryVal == '') {
            $('#countryid').after('<div class="error-message" id="country-error">*Please enter a Country Name.</div>');
            event.preventDefault()

        } else if (!countryRegex.test(countryVal)) {
            $('#countryid').after('<div class="error-message" id="country-error">*Please enter a valid Country Name</div>');
            event.preventDefault()



        }







        //MAKE POST REQUEST AND SEND FORM DATA
        $.ajax({
            type: 'POST',
            url: '/home',
            dataType: false,
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log("TATA AT SUCCESS AT /HOME POST")
                if (response.errors) {
                    if (response.errors.error_email) {
                        $('#emailid').after('<div class="error-message" id="number-error">*Email Already exists</div>'); event.preventDefault()
                    }
                    if (response.errors.error_number) {
                        $('#numberid').after('<div class="error-message" id="number-error">*Number Already exists</div>'); event.preventDefault()
                    }

                } else {

                    clearInputs();
                    Show();
                }


            },
            error: function (e) {
                console.log(e);
                console.log("TATA AT ERROR AT /HOME POST")
            }
        })
    });


    //****** REQUEST FOR SEARCH ******
    $(`#b`).click(function (event) {
        page = 1
        event.preventDefault()
        Show()


        let searchVal = $("#search").val()

    })

    //****** REQUEST FOR DELETE *******
    $('table').on('click', '.delete-button', function (event) {
        const Sure = confirm("Are You Sure?")
        if (Sure === false) {
            Show()
            return
        }

        let rowID = $(this).attr("id")
         let lastid = rowID.slice(0,4)
        // id = rowID.slice(1);

        
        if (lastid == "last") {
            console.log(`halo`);
            id = rowID.slice(4);
            page--

        }else{
            id = rowID.slice(1);
            
        }

        console.log(id);
        $.ajax({
            url: `/delete/${id}`,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {

                Show()



            },
            error: function (e) {
                console.log("TATA AT ERROR AT /HOME POST")
            }
        });


    });


    //***** UPDATE BUTTON FUNCTIONALITY ********
    $('table').on('click', '.update-button', function () {

        let rowEl = $(this).attr("id")
        let id = rowEl.slice(1);

        // $(`input`).attr(`disabled`)
        $(`#${id} td input`).removeAttr(`disabled`)


        $(`#${id} .imgtd`).html(`<input id="fileid" class="imgClass" type="file" name="avatar">`)


        $(`#b${id}`).html(`<button class="save-button btn btn-outline-success" id="s${id}" >Save</button>\<button class="cancel-button btn btn-outline-secondary" >cancel</button>`)




    });


    //*************  SAVE USERS UPDATED DATA *******
    $('table').on('click', '.save-button', function (event) {
        // event.preventDefault()
        let rowID = $(this).attr("id")
        let id = rowID.slice(1);
        $(`.error-message`).empty()

        //STORE ALL FORM VALUES
        const nameVal = $(`#${id} .nametd input`).val()
        const emailVal = $(`#${id} .emailtd input`).val()
        const numberVal = $(`#${id} .numbertd input`).val()
        const countryVal = $(`#${id} .countrytd input`).val()
        const fileVal = $(`#${id}> .imgtd > .imgClass`)[0]

        //CREATE FORMDATA AND ADD FORM VALUED
        const formdata = new FormData()
        formdata.append("name", nameVal)
        formdata.append("email", emailVal)
        formdata.append("mobile", numberVal)
        formdata.append("country", countryVal)
        formdata.append("avatar", fileVal.files[0])

        //ASSIGN REGEX FOR UPDATED VALUE
        var nameRegex = /^[a-zA-Z\s]*$/;
        var countryRegex = /^[a-zA-Z\s]*$/;
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var contactRegex = /^[0-9]{10}$/;
let upload = true

        if (nameVal == '') {
            $(`#${id} .nametd input`).after('<div class="error-message" id="name-error">*Please enter your name.</div>');
            upload = false
            event.preventDefault()
        } else if (!nameRegex.test(nameVal)) {
            $(`#${id} .nametd input`).after('<div class="error-message" id="name-error">*Please enter your valid name.</div>');
            upload = false
            event.preventDefault()

        }

        if (emailVal == '') {
            $(`#${id} .emailtd input`).after('<div class="error-message" id="email-error">*Please enter your email.</div>');
            upload = false
            event.preventDefault()


        } else if (!emailRegex.test(emailVal)) {
            $(`#${id} .emailtd input`).after('<div class="error-message" id="email-error">*Please enter valid email.</div>');
            upload = false
            event.preventDefault()

        }

        if (numberVal == '') {
            $(`#${id} .numbertd input`).after('<div class="error-message" id="number-error">*Please enter a 10 digit contact number.</div>');
            upload = false
            event.preventDefault()


        } else if (!contactRegex.test(numberVal)) {
            $(`#${id} .numbertd input`).after('<div class="error-message" id="number-error">*Please enter a valid 10 digit contact number.</div>');
            upload = false
            event.preventDefault()

        }
     

        if (countryVal == '') {
            $(`#${id} .countrytd input`).after('<div class="error-message" id="country-error">*Please enter a Country Name.</div>');
            upload = false
            event.preventDefault()


        } else if (!countryRegex.test(countryVal)) {
            $(`#${id} .countrytd input`).after('<div class="error-message" id="country-error">*Please enter a valid Country Name</div>');
            upload = false
            event.preventDefault()

        }

        if(upload==false){
            return
        }
        upload=true
        //SEND AJAX REQUEST FOR UPDATION OF DATA
        $.ajax({
            url: `/update?id=${id}`,
            method: 'PATCH',
            dataType: false,
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response) {

                Show()
            },
            error: function (error) {
                console.log("ERROR AT /HOME PATCH:(UPDATING DATA)")
            }
        });

    });

    //********* CANCEL UPDATION OF DATA *******
    $('table').on('click', '.cancel-button', function () {
        Show()

    });

    //*******  PAGINATION ACCESS ***********
    $('footer').on(`click`, `button`, function (event) {

        if (($(this).attr('id') === 'previouspage') && (page > 1)) {

            page--
            Show()

        } else if (($(this).attr('id') === 'nextpage') && (page != lastPage)) {

            page++
            Show()

        } else {

            page = parseInt($(this).text());
            Show()

        }

    });

});