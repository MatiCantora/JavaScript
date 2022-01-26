//DOM
let notebooksJS = document.getElementById("notebooksJS")
let mostrarProducto = document.getElementById("mostrarProducto")
let borrarCarrito = document.getElementById("borrarCarrito")
let contadorCarrito = document.getElementById("contadorCarrito")
let carritoBody = document.getElementById("carritoBody")
let totalCarrito = document.getElementById("totalCarrito")
let categorias = document.getElementById("categorias")
let icon = document.getElementById("carritoIcon")

let cantidadCarrito = 0
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
if (carrito.length > 0) {
	icon.classList.add("carritoOcupado")
}
class Notebook {
	constructor(id, modelo, marca, procesador, precio, stock, img) {
		this.id = id
		this.modelo = modelo
		this.marca = marca
		this.procesador = procesador
		this.precio = precio
		this.stock = stock
		this.img = img
	}
}

let notebooks = []

$.ajax({
	url: "stock.json",
	dataType: "json",
	success: function (data) {
		data.forEach((notebook) => {
			notebooks.push(notebook)
		})
		return
	},
})

let oculto = true
let acumuladorProductos = ``
setTimeout(() => {
	notebooks.forEach((notebook) => {
		acumuladorProductos += `
		<div class="col">
		<div class="card" style="width: 18rem;">
		<img src="./img/${notebook.img}" class="card-img-top imgProd" alt="...">
		  <div class="card-body text-center">
			<h5 class="card-title titleProd" id="">${notebook.modelo}</h5>
			<p class="card-text descriptionProd" id="">${notebook.marca}</p>
			<p class="card-text priceProd" id="">$${notebook.precio}</p>
			<button data-id="${notebook.id}" class="btn btn-primary agregar-carrito">Agregar</button>
		  </div>
		</div>
	  </div>`
	})
}, 2000)

if (mostrarProducto) {
	mostrarProducto.addEventListener("click", () => {
		if (oculto) {
			notebooksJS.innerHTML = acumuladorProductos
			oculto = false
		} else {
			notebooksJS.innerHTML = ``
			oculto = true
		}
	})
}

if (notebooksJS) {
	notebooksJS.addEventListener("click", agregarAlCarrito)
}

// Funciones
function agregarAlCarrito(e) {
	e.preventDefault()
	if (e.target.classList.contains("agregar-carrito")) {
		const productoSeleccionado = e.target.parentNode

		obtenerDatos(productoSeleccionado)
	}
}

function obtenerDatos(productoCard) {
	const datosProducto = {
		nombre: productoCard.querySelector(".titleProd").textContent,
		modelo: productoCard.querySelector(".descriptionProd").textContent,
		precio: productoCard.querySelector(".priceProd").textContent,
		img: productoCard.parentNode.querySelector(".imgProd").src,
		id: productoCard.querySelector(".agregar-carrito").getAttribute("data-id"),
		cantidad: 1,
	}

	const existe = carrito.some((producto) => producto.id == datosProducto.id)

	if (existe) {
		const productos = carrito.map((producto) => {
			if (producto.id === datosProducto.id) {
				producto.cantidad++
				return producto
			} else {
				return producto
			}
			articulosCarrito = [...productos]
		})
	} else {
		//Pushear al carrito
		carrito.push(datosProducto)
	}

	icon.classList.add("carritoOcupado")

	guardarStorage()
}

function guardarStorage() {
	localStorage.setItem("carrito", JSON.stringify(carrito))
}

function limpiarCarrito() {
	carrito.length = 0
	icon.classList.remove("carritoOcupado")

	guardarStorage()
}

// Eventos
$("#borrarCarrito").on("click", function () {
	limpiarCarrito()
})

let switchButton = document.getElementById("switch")

switchButton.addEventListener("click", () => {
	document.body.classList.toggle("dark")
	switchButton.classList.toggle("active")
})

// Function para eliminar elemento del carrito
$(carritoBody).click(quitarProducto)
function quitarProducto(e) {
	if (e.target.classList.contains("borrar-producto")) {
		e.preventDefault()
		const productoId = e.target.getAttribute("data-id")

		/* Filtro los productos del carrito */
		carrito = carrito.filter((producto) => producto.id != productoId)

		if (carrito.length == 0) {
			icon.classList.remove("carritoOcupado")
		}
		insertarHTMLCarrito()
		guardarStorage()
	}
}

function insertarHTMLCarrito() {
	carritoBody.innerHTML = ``

	let total = 0
	carrito.forEach((producto) => {
		const { img, nombre, modelo, precio, id, cantidad } = producto
		const row = document.createElement("tr")

		row.innerHTML = `
            <td>
                <img src="${img}" width=100>
            </td>
            <td>
                ${modelo}
            </td>
            <td>
                ${nombre}
            </td>
            <td>
                ${cantidad}
            </td>
            <td>
                ${precio}
            </td>
            <td class="text-center">
                <a href="#" class="borrar-producto" data-id="${id}"> X </a>
            </td>
        `
		carritoBody.appendChild(row)

		// const cantidadProducto = cantidad
		const precioProducto = Number(precio.replace("$", ""))
		total = total + precioProducto * cantidad
	})
	totalCarrito.innerHTML = `$${total.toFixed(2)}`
}

categorias.addEventListener("click", (e) => {
	if (e.target.classList.contains("categoria")) {
		let category = e.target.textContent
		let acumuladorProductos = ``
		notebooksJS.innerHTML = ``

		let seleccion = notebooks.filter(
			(note) => note.procesador.split(" ")[0] === category
		)

		seleccion.forEach((notebook) => {
			acumuladorProductos += `
			<div class="col">
			<div class="card" style="width: 18rem;">
			<img src="./img/${notebook.img}" class="card-img-top imgProd" alt="...">
			  <div class="card-body text-center">
				<h5 class="card-title titleProd" id="">${notebook.modelo}</h5>
				<p class="card-text descriptionProd" id="">${notebook.marca}</p>
				<p class="card-text priceProd" id="">$${notebook.precio}</p>
				<button data-id="${notebook.id}" class="btn btn-primary agregar-carrito">Agregar</button>
			  </div>
			</div>
		  </div>`
		})
		notebooksJS.innerHTML = acumuladorProductos
	}
})

async function finalizar() {
	if (carrito.length > 0) {
		new Promise((resolve) => {
			resolve(
				swal({
					title: "Compra realizada!",
					text: "Tu factura estará lista en breve",
					icon: "success",
					button: "Ok",
				})
			)
		}).then(() => {
			guardarStorage()
			limpiarCarrito()
			window.location.replace("index.html")
		})
	} else {
		swal("No hay productos en el carrito", "", "error")
	}
}
