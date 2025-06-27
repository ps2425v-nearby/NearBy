// tests/utils/debounce.test.ts
import { debounce } from '@/utils/debounce'; // ajuste o caminho conforme necessário

describe('debounce', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(global, 'requestAnimationFrame').mockImplementation(cb => {
            return setTimeout(cb, 16) as unknown as number;
        });
        jest.spyOn(global, 'cancelAnimationFrame').mockImplementation((id: number) => {
            clearTimeout(id);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    test('calls the function only once on rapid calls', () => {
        const fn = jest.fn();
        const debounced = debounce(fn);

        debounced('first');
        debounced('second');

        expect(fn).not.toBeCalled();

        jest.advanceTimersByTime(20);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith('second'); // última chamada
    });
});
