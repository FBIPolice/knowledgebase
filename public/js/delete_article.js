$(() => {
	$('#delete-article').on('click', (e) => {
		e.preventDefault()
		const id = $(e.target).attr('data-id')
		$.ajax({
			type: 'DELETE',
			url: '/article/' + id,
			success: (response) => {
				window.location.href = '/'
			},
			error: (err) => {
				console.log(err)
			}
		})
	})
})
