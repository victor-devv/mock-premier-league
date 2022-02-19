import 'jest';
import limiter from '../../config/request-limit'

describe('limiter', () => {

    it('should be defined', async () => {
        expect(limiter).toBeDefined();
    });

})