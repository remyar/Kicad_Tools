import Action from '../actions';
import Api from '../api';
import { put, takeEvery } from 'redux-saga/effects'

export default function* getGithubAllCategories(data) {
    try{
        let file = yield Api.Github.getGithubAllCategories();
        //let json = yield Api.Github.getGithubAllComponent(file);
        yield put({ type: Action.github.GET_ALL_GITHUB_CATEGORIES_SUCCESS , data : file });
    } catch (e) {
        console.error(e);
        yield put({ type: Action.github.GET_ALL_GITHUB_CATEGORIES_ERROR , data : { status : e.message , time : new Date().getTime() }})
    }
}