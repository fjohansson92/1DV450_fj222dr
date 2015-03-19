describe("RestaurantFactories", function() {

	describe("RestaurantFactory", function() {

		beforeEach(function() {
			module('RestaurantManager');

			angular.mock.inject(function ($injector) {
				$httpBackend = $injector.get('$httpBackend');
				mockRestaurantFactory = $injector.get('RestaurantFactory');
				mockAPIConstant = $injector.get('API');
			})
		});


		it('factory should get all', function() {
			
			$httpBackend.expectGET(mockAPIConstant + 'restaurants').respond({restaurants : 'test'});

			var result = mockRestaurantFactory.get();

			$httpBackend.flush();

			expect(result.restaurants).toEqual('test');
	  	});


	  	it('factory should get single', function() {
			
			$httpBackend.expectGET(mockAPIConstant + 'restaurants/1').respond({restaurants : 'test'});

			var result = mockRestaurantFactory.get({ id: 1 });

			$httpBackend.flush();

			expect(result.restaurants).toEqual('test');
	  	});


	  	it('factory should post', function() {
			/*
			$httpBackend.expectPOST(mockAPIConstant + 'restaurants', { "object": {} }).respond({restaurant: 'test'})

			var result = mockRestaurantFactory.save({ object: {}})

			$httpBackend.flush();

			expect(result.restaurant).toEqual('test');
			*/
	  	});


	  	it('factory should delete', function() {
			
			$httpBackend.expectDELETE(mockAPIConstant + 'restaurants/1').respond({restaurant: 'test'})

			var result = mockRestaurantFactory.remove({ id: 1 })

			$httpBackend.flush();

			expect(result.restaurant).toEqual('test');
	  	});

	  	it('factory should update', function() {
			
			$httpBackend.expectPUT(mockAPIConstant + 'restaurants/1', { "object": {} }).respond({restaurant: 'test'})

			var result = mockRestaurantFactory.put({ id: 1 }, { "object": {} })

			$httpBackend.flush();

			expect(result.restaurant).toEqual('test');
	  	});
	});






	describe("PositionFactory", function() {

		beforeEach(function() {
			module('RestaurantManager');

			angular.mock.inject(function ($injector) {
				$httpBackend = $injector.get('$httpBackend');
				mockRestaurantFactory = $injector.get('PositionFactory');
				mockAPIConstant = $injector.get('API');
			})
		});


		it('factory should get all', function() {
			
			$httpBackend.expectGET(mockAPIConstant + 'positions').respond({restaurants : 'test'});

			var result = mockRestaurantFactory.get();

			$httpBackend.flush();

			expect(result.restaurants).toEqual('test');
	  	});
	});
});