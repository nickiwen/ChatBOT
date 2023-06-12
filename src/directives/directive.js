const focusDirective = {}
focusDirective.install = app => {
    app.directive('myfocus', {
        mounted: (el, binding) => {
            if (binding.value == true || binding.value == undefined) {
                el.focus()
            }
        }
    });
}

export default focusDirective