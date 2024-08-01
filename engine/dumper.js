function dumpMethods(object) {
    var methods = object.getClass().getMethods()
    printAllOfArray(methods)
}
function dumpDeclaredMethods(object) {
    var methods = object.getClass().getDeclaredMethods()
    printAllOfArray(methods)
}
function dumpFields(object) {
    var fields = object.getClass().getFields()
    printAllOfArray(fields)
}
function dumpDeclaredFields(object) {
    var fields = object.getClass().getDeclaredFields()
    printAllOfArray(fields)
}

function printAllOfArray(array) {
    for (var i = 0; i < array.length; i++) {
        print(array[i])
    }
}

