export default abstract class MarketApi<T>{
    abstract getResponse(): Promise<T>;
}