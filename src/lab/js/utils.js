window.SERVER = "http://localhost:4647";

function submitForm() {
    const $form = $('form[name="myform"]');

    let args = $form.serializeArray().reduce((prev, cur) => {
        return {...prev, [cur.name]: cur.value};
    }, {});

    if (window.extraArgs)
        args = {...args, ...window.extraArgs()};

    $.ajax({
        url: SERVER + "/exp-" + window.EXP_NAME,
        type: "POST",
        headers: {
            "token": localStorage.getItem("token"),
        },
        dataType: "json",
        data: JSON.stringify(args),
        contentType: "application/json",
        success: function (data, status, xhr) {
            if (status === "success") {
                if (data.error) console.error(data.error);
                else {
                    const $container = document.querySelector(".image-container");
                    while ($container.firstElementChild) $container.removeChild($container.firstElementChild);
                    const $result = $("#result");
                    $result.html("");

                    if (data.images) {
                        for (let i = 1; i <= data.images.length; i++) {
                            const img = document.createElement("img");
                            img.setAttribute("width", "600");
                            img.classList.add("my-2");
                            img.src = "data:image/png;base64," + data.images[i - 1];
                            $container.appendChild(img);
                        }
                    }

                    if (data.result) {
                        $result.html(data.result);
                    }
                }
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function submit(e) {
    submitForm();
    e.preventDefault();
}

/**
 * @param elm {Element}
 * @param list {Object<String,String>}
 */
function appendOptions(elm, list) {
    for (const [value, str] of Object.entries(list)) {
        const option = document.createElement("option");
        option.innerText = str;
        option.value = value;
        elm.appendChild(option);
    }
    elm.firstElementChild.setAttribute("selected", "selected");
}

function onload() {
    if (document.readyState === "complete") {
        if (!localStorage.getItem("token")) {
            $.get(`${SERVER}/get_token`, success = function (data) {
                localStorage.setItem("token", data);
            })
        }
        if (window.appenditure)
            for (const [elmName, value] of Object.entries(window.appenditure)) {
                appendOptions(document.myform[elmName], value);
            }

        if (window.otherSetters) {
            for (const [key, value] of Object.entries(window.otherSetters)) {
                document.myform[key].value = value;
            }
        }

        $('form[name="myform"]').submit(submit);

        submitForm();
    } else {
        setTimeout(onload, 100);
    }
}

$(document).ready(onload);
