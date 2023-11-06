import colors from "@/assets/standardcolors.json";

export default () => {
    const docstyle = document.documentElement.style;
    docstyle.setProperty("--appbackgroundcolor", colors.appbackground);
    docstyle.setProperty("--backgroundcolor", colors.background);
    docstyle.setProperty("--ioheadercolor", colors.ioheader);
    docstyle.setProperty("--headercolor", colors.headerbackground);
    docstyle.setProperty("--headerbordercolor", colors.headerborder);

    docstyle.setProperty("--errorbordercolor", colors.errorborder);
    docstyle.setProperty("--errorbackgroundcolor", colors.errorbackground);
    docstyle.setProperty("--warningbordercolor", colors.warningborder);
    docstyle.setProperty("--warningbackgroundcolor", colors.warningbackground);
    docstyle.setProperty("--succesbordercolor", colors.succesborder);
    docstyle.setProperty("--succesbackgroundcolor", colors.succesbackground);

    docstyle.setProperty("--basicbuttoncolor", colors.basicbutton);
    docstyle.setProperty("--basicbuttonbordercolor", colors.basicbuttonborder);
    docstyle.setProperty("--basicbuttonhovercolor", colors.basicbuttonhover);
}