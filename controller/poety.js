import poetyModel from '../models/poety';
import File from './file';

class Poety {
  constructor() {

  }
  async queryPoety(req, res, next) {
    try {
      const { type, page } = req.body;
      let filter = {}
      if (type !== 'all') {
        filter = { type }
      }
      const total = await poetyModel.find(filter).count();
      const poetyList = await poetyModel.find(filter, { content: 0, type: 0, toOther: 0 }).skip((page - 1) * 5)
        .limit(5);
      res.send({
        state: '1',
        data: {
          poetyList,
          total
        },
        type: 'success_get_poetyList',
        message: '获取诗文列表成功'
      })
    } catch (err) {
      res.send({
        status: '0',
        type: 'error_get_poetyList',
        message: err
      })
    }
  }
  async addPoety(req, res, next) {
    try {
      const item = req.body;
      const lists = await poetyModel.create(item);
      res.send({
        state: '1',
        type: 'success_add_poety',
        data: true,
        message: '添加诗文成功'
      })
    } catch (err) {
      res.send({
        status: '0',
        type: 'error_add_poety',
        message: err
      })
    }
  }
  async poetyDetail(req, res, next) {
    try {
      const id = req.body.id;
      const lists = await poetyModel.findById(id);
      res.send({
        state: '1',
        data: lists,
        type: 'success_get_poetyDetail',
        message: '获取诗文详情成功'
      })
    } catch (err) {
      res.send({
        status: '0',
        type: 'error_get_poetyDetail',
        message: err
      })
    }
  }
  async removePoety(req, res, next) {
    try {
      const lists = await poetyModel.remove();
      res.send({
        state: '1',
        type: 'success_remove_poety',
        message: '清除诗文成功'
      })
    } catch (err) {
      res.send({
        status: '0',
        type: 'error_remove_poety',
        message: err
      })
    }
  }
  async savePoetyJson(req, res, next) {
    try {
      const lists = await poetyModel.find({});
      await File.writeFile('poety.json', JSON.stringify(lists))
      res.send({
        state: '1',
        type: 'success_save_poetJson',
        message: '生成诗文成功'
      })
    } catch (err) {
      res.send({
        status: '0',
        type: 'error_save_poetJson',
        message: err
      })
    }
  }
  async readPoetyJson(req, res, next) {
    try {
      const data = JSON.parse(await File.readFile('./poety.json'))
      await poetyModel.insertMany(data)
      res.send({
        state: '1',
        type: 'success_read_poetJson',
        message: '读取诗文成功'
      })
    } catch (err) {
      res.send({
        status: '0',
        type: 'error_read_poetJson',
        message: err
      })
    }
  }
}
export default new Poety();