import './iconpicker.scss'

export default class Iconpicker
{
    constructor(el, options) {
        this.el = el
        this.options = options

        const {
            hideOnSelect = true,
            selectedClass = 'selected',
            defaultValue = '',
            icons = [],
            iconPath = '',
            searchable = true,
            containerClass = '',
            showSelectedIn = null
        } = options
        this.valueFormat = typeof options?.valueFormat === "function" ? options.valueFormat : val => val

        this.el.insertAdjacentHTML('afterend', `
            <div class="iconpicker-dropdown ${containerClass}">
                <ul>
                    ${icons.map(icon => `<li value="${this.valueFormat(icon)}" class="${defaultValue === icon ? selectedClass : ''}"><img src='${iconPath}${this.valueFormat(icon)}.svg' /></li>`).join('')}
                </ul>
            </div>
        `)

        this.el.nextElementSibling.querySelectorAll('li').forEach(item => item.addEventListener('click', e => {
            this.el.nextElementSibling.querySelector('li.selected')?.classList.remove(selectedClass)
            item.classList.add(selectedClass)
            const value = item.getAttribute('value')
            this.el.value = value

            if(hideOnSelect){
                this.el.nextElementSibling.classList.remove('show')
            }

            if (showSelectedIn){
                this.options.showSelectedIn.innerHTML = `<img src='${iconPath}${value}.svg' />`
            }
        }))

        if (searchable){
            this.el.addEventListener('keyup', this.search)
        }

        this.el.addEventListener('focusin', this.focusIn)
        this.el.addEventListener('change', this.setIconOnChange)

        this.el.value = this.valueFormat(defaultValue)
        this.el.dispatchEvent(new Event('change'))
    }

    /**
     * Use input as a search box
     */
    search() {
        const items = this.nextElementSibling.getElementsByTagName('li')
        const pattern = new RegExp(this.value, 'i');

        for (let i=0; i < items.length; i++) {
            const item = items[i];
            if (pattern.test(item.getAttribute('value'))) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        }
    }

    /**
     * if showSelectedIn argument passed show icon in that element
     */
    setIconOnChange = () => {
        if (this.options?.showSelectedIn){
            let path = this.options.iconPath + this.el.value
            this.options.showSelectedIn.innerHTML = `<img src='${path}.svg' />`
        }
    }

    /**
     * Focus event for given input element
     */
    focusIn = () => {
        if(this.el.nextElementSibling?.classList?.contains('iconpicker-dropdown')){
            this.el.nextElementSibling.querySelector('ul').style.top = this.el.offsetHeight + 'px'
            if(this.options?.fade ?? false){
                this.el.nextElementSibling.style.transition = '0.25s ease-in-out';
            }
            this.el.nextElementSibling.classList.add('show')
        }
    }
    
    set = (setValue = '') => this.el.value = this.valueFormat(setValue)
}

window.Iconpicker = Iconpicker

/**
 * Close iconpicker on click outside
 */
document.addEventListener('click', e => {
    document.querySelectorAll('.iconpicker-dropdown').forEach(dw => {
        const isClickInside = dw.contains(e.target) || dw.previousElementSibling.contains(e.target)

        if (!isClickInside) {
            dw.classList.remove('show')
        }
    })
});
