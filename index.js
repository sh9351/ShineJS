const waitForElm = selector => new Promise(resolve => {
    if (document.querySelector(selector)) resolve(document.querySelector(selector))
    const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
            resolve(document.querySelector(selector))
            observer.disconnect()
        }
    })
    observer.observe(document, {
        childList: true,
        subtree: true
    })
})
const script = Array.from(document.querySelectorAll('script')).filter(i => i.outerHTML.includes('shine'))[0]
waitForElm(script.getAttribute('mount') || 'app').then(() => {
    if (script.getAttribute('log')) {
        log = console.trace
    } else {
        log => ShineJS.Logs.push(log)
    }
    log('ShineJS: OnLoad')
    const render = () => {
        log('ShineJS: Render')
        let text = HTML
        let previousText = mountTarget.innerHTML
        Object.keys(ShineJS.States).forEach(key => {
            text.split('{').slice(1).forEach(i => {
                text = text.replaceAll('{' + i.split('}')[0] + '}', ShineJS.States[key])
            })
        })
        if (previousText != text) mountTarget.innerHTML = text
        else log('ShineJS: ElementNoDiff')
    }
    const mountTarget = document.querySelector(script.getAttribute('mount') || 'app')
    ShineJS = {
        useState: (key, value) => {
            ShineJS.States[key] = value
            log('ShineJS: setState\n' + key + ': ' + value)
            render()
            Object.defineProperty(window, key, {
                get: () => ShineJS.States[key],
                set: value => {
                    ShineJS.States[key] = value
                    log('ShineJS: setState\n' + key + ': ' + value)
                    render()
                },
                configurable: true
            })
        },
        States: {},
        Logs: []
    }
    const HTML = mountTarget.innerHTML
})
